import os
import base64
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from passlib.hash import bcrypt
from jose import jwt, JWTError
from dotenv import load_dotenv
from psycopg2 import IntegrityError
from blog_table import create_blog_table
from blog_insert import insert_sample_blog_posts
from dbfunctions import db_result
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from dateutil import parser
# import jwt 
# Load environment variables
load_dotenv()

# JWT Config
SECRET_KEY = os.getenv("JWT_SECRET", "mysecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
print(f"Loaded JWT secret: {SECRET_KEY}")

app = FastAPI()

# CORS
origins = ["http://localhost:5173", "http://127.0.0.1:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # Use the specific allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================
# MODELS
# =====================
class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class BlogPost(BaseModel):
    id: str
    title: str
    author: str
    createdAt: str
    content: str
    tags: list[str]
    image: str | None = None

class PostUpdateSchema(BaseModel):
    title: Optional[str]
    content: Optional[str]
    tags: Optional[List[str]]

# =====================
# AUTH HELPERS
# =====================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme)):
    print(f"Received token: {token}")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        print(f"Decoded email from token: {email}")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError as e:
        print(f"JWT error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")


def create_user_table():

    query_create = """
    CREATE TABLE IF NOT EXISTS public.users (
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        PRIMARY KEY (username, email)
    );
    """
    db_result(query_create)
    print("Users table created with composite primary key (name, email).")

# =====================
# STARTUP
# =====================
@app.on_event("startup")
async def startup_event():
    create_blog_table()
    insert_sample_blog_posts()
    create_user_table()

# =====================
# REGISTER
# =====================
@app.post("/register")
def register(user: UserRegister):
    user_email = user.email.strip().lower()
    user_username = user.username.strip()
    
    check_query = """
        SELECT username, email FROM public.users
        WHERE username = %s OR LOWER(email) = %s;
    """
    existing = db_result(check_query, (user_username, user_email))
    if existing:
        existing_user, existing_email = existing[0]
        if existing_user == user_username:
            raise HTTPException(status_code=400, detail="Username already exists")
        elif existing_email == user_email:
            raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = bcrypt.hash(user.password)
    insert_query = """
        INSERT INTO public.users (username, email, password)
        VALUES (%s, %s, %s);
    """
    try:
        db_result(insert_query, (user_username, user_email, hashed_pw))
    except IntegrityError:
        raise HTTPException(status_code=400, detail="User already exists")

    return {"message": "Registration successful", "redirect_to": "/login"}


# =====================
# LOGIN
# =====================


@app.post("/login")
def login(data: UserLogin):
    email = data.email.strip().lower()
    password = data.password
    print(f"Login attempt: email={email}")

    query = "SELECT username, email, password FROM public.users WHERE LOWER(email) = %s;"
    result = db_result(query, (email,), fetch_results=True)

    print(f"DB query result: {result}")
    if not result:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    username, user_email, hashed_password = result[0]
    print(f"User found: {username}")

    if isinstance(hashed_password, bytes):
        hashed_password = hashed_password.decode('utf-8')

    if not bcrypt.verify(password, hashed_password):
        print("Password verification failed")
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = jwt.encode({"sub": user_email}, SECRET_KEY, algorithm=ALGORITHM)
    print("Login successful")
    return {"token": token}



# =====================
# GET POSTS
# =====================


@app.get("/api/posts/{postid}")
def get_post(postid: str):
    query = """
        SELECT postid, title, author, createdat, content, tags, image, isdeleted
        FROM public.blog
        WHERE postid = %s AND (isdeleted = FALSE OR isdeleted IS NULL);
    """
    res = db_result(query, (postid,), fetch_results=True)
    if not res:
        raise HTTPException(status_code=404, detail="Post not found")

    postid, title, author, createdat, content, tags, image, isdeleted = res[0]

    if isinstance(tags, str):
        tags = tags.strip("{}").split(",") if tags else []

    image_base64 = None
    if image:
        import base64
        image_base64 = f"data:image/png;base64,{base64.b64encode(image).decode('utf-8')}"

    return {
        "postid": str(postid),
        "title": title,
        "author": author,
        "createdat": createdat,
        "content": content,
        "tags": tags or [],
        "image": image_base64,
        "isdeleted": isdeleted,
    }


@app.get("/api/posts")
def get_posts():
    query = """
        SELECT postid, title, author, createdat, content, tags, image, isdeleted
        FROM public.blog
        WHERE isdeleted = FALSE OR isdeleted IS NULL
        ORDER BY createdat DESC;
    """
    rows = db_result(query, fetch_results=True)
    print("DEBUG: fetched rows:", rows)  # add this line

    posts = []
    for row in rows:
        postid, title, author, createdat, content, tags, image, isdeleted = row
        image_base64 = (
            f"data:image/png;base64,{base64.b64encode(image).decode('utf-8')}" if image else None
        )
        posts.append({
            "id": str(postid),
            "title": title,
            "author": author,
            "createdAt": createdat.isoformat() if createdat else None,
            "content": content,
            "tags": tags if tags else [],
            "image": image_base64,
        })
    print("DEBUG: posts prepared:", posts)  # add this line
    return posts



# =====================
# CREATE POST (Protected)
# =====================


def get_username_from_email(email: str) -> str:
    query = "SELECT username FROM public.users WHERE email = %s"
    result = db_result(query, (email,), fetch_results=True)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return result[0][0]

@app.post("/api/posts")
def create_post(post: BlogPost, current_user_email: str = Depends(get_current_user)):
    author = get_username_from_email(current_user_email)  # username here

    created_at_dt = datetime.fromisoformat(post.createdAt)
    image_bytes = None
    if post.image and post.image.startswith("data:image"):
        _, base64_data = post.image.split(",", 1)
        image_bytes = base64.b64decode(base64_data)

    query = """
        INSERT INTO public.blog (postid, title, author, createdat, content, tags, image)
        VALUES (%s, %s, %s, %s, %s, %s, %s);
    """
    db_result(query, (
        post.id,
        post.title,
        author,  # use username from email here
        created_at_dt,
        post.content,
        post.tags,
        image_bytes
    ))
    return {"message": "Post created successfully", "id": post.id}


router = APIRouter()

class Post(BaseModel):
    postid: str
    title: str
    author: str
    createdat: datetime
    content: str
    tags: List[str] = []
    isdeleted: bool

class PostUpdate(BaseModel):
    title: str
    content: str
    tags: List[str] = []


@router.get("/api/myposts")
def get_my_posts(current_user: str = Depends(get_current_user)):
    print("Inside /api/myposts endpoint")
    author = get_author(current_user)
    query = """
    SELECT postid, title, author, createdat, content, tags, image, isdeleted
    FROM public.blog
    WHERE author = %s AND (isdeleted = FALSE OR isdeleted IS NULL);
    """
    posts = db_result(query, (author,), fetch_results=True)

    formatted_posts = []
    for p in posts:
        postid, title, author, createdat, content, tags, image, isdeleted = p
        if isinstance(tags, str):
            tags = [tag.strip() for tag in tags.strip('{}').split(',')] if tags else []

        image_base64 = None
        if image:
            import base64
            image_base64 = "data:image/png;base64," + base64.b64encode(image).decode('utf-8')

        formatted_posts.append({
            "postid": str(postid),
            "title": title,
            "author": author,
            "createdat": createdat.isoformat() if createdat else None,
            "content": content,
            "tags": tags or [],
            "image": image_base64,
            "isdeleted": isdeleted
        })

    print("DEBUG formatted_posts:", formatted_posts)
    return formatted_posts



@router.get("/api/posts/{postid}")
def get_post(postid: str, current_user=Depends(get_current_user)):
    author = get_author(current_user)
    query = """
        SELECT postid, title, author, createdat, content, tags, image, isdeleted
        FROM public.blog
        WHERE postid = %s AND author = %s AND (isdeleted = FALSE OR isdeleted IS NULL);
    """
    res = db_result(query, (postid, author), fetch_results=True)
    if not res:
        raise HTTPException(status_code=404, detail="Post not found or unauthorized")

    postid, title, author, createdat, content, tags, image, isdeleted = res[0]

    if isinstance(tags, str):
        tags = tags.strip("{}").split(",") if tags else []

    image_base64 = None
    if image:
        import base64
        image_base64 = f"data:image/png;base64,{base64.b64encode(image).decode('utf-8')}"

    return {
        "postid": str(postid),
        "title": title,
        "author": author,
        "createdat": createdat,
        "content": content,
        "tags": tags or [],
        "image": image_base64,
        "isdeleted": isdeleted,
    }


def get_author(user_identifier: str) -> str:
    if "@" in user_identifier:
        query = "SELECT username FROM public.users WHERE email = %s"
        res = db_result(query, (user_identifier,), fetch_results=True)
        if res:
            return res[0][0]
    else:
        query = "SELECT username FROM public.users WHERE username = %s"
        res = db_result(query, (user_identifier,), fetch_results=True)
        if res:
            return res[0][0]

    raise HTTPException(status_code=404, detail="Author not found")



@router.put("/api/posts/{postid}")
def update_post(postid: str, post_data: PostUpdate, current_user=Depends(get_current_user)):
    author = get_author(current_user)

    check_query = "SELECT postid FROM public.blog WHERE postid = %s AND author = %s;"
    res = db_result(check_query, (postid, author), fetch_results=True)
    if not res:
        raise HTTPException(status_code=404, detail="Post not found or unauthorized")

    update_fields = []
    update_values = []

    if post_data.title is not None:
        update_fields.append("title = %s")
        update_values.append(post_data.title)
    if post_data.content is not None:
        update_fields.append("content = %s")
        update_values.append(post_data.content)
    if post_data.tags is not None:
        update_fields.append("tags = %s")
        update_values.append(post_data.tags)

    if not update_fields:
        raise HTTPException(status_code=400, detail="At least one field must be provided for update")

    update_values.append(postid)
    update_query = f"UPDATE public.blog SET {', '.join(update_fields)} WHERE postid = %s;"
    db_result(update_query, tuple(update_values))

    return {"message": "Post updated"}



@router.patch("/api/posts/{postid}/delete")
def soft_delete_post(postid: str, current_user=Depends(get_current_user)):
    author = get_author(current_user)
    check_query = "SELECT postid FROM public.blog WHERE postid = %s AND author = %s;"
    res = db_result(check_query, (postid, author), fetch_results=True)
    if not res:
        raise HTTPException(status_code=404, detail="Post not found or unauthorized")
    update_query = "UPDATE public.blog SET isdeleted = TRUE WHERE postid = %s;"
    db_result(update_query, (postid,))
    return {"message": "Post soft deleted"}


@app.get("/api/me")
def get_current_user_info(current_user_email: str = Depends(get_current_user)):
    query = "SELECT username FROM public.users WHERE email = %s"
    result = db_result(query, (current_user_email,), fetch_results=True)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return {"username": result[0][0]}


app.include_router(router)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    

# # main.py
# import os
# from fastapi import FastAPI, Depends, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from dotenv import load_dotenv
# from auth import router as auth_router, get_current_user, oauth2_scheme
# from posts import router as posts_router
# from myposts import router as myposts_router, get_author
# from blog_table import create_blog_table
# from blog_insert import insert_sample_blog_posts
# from dbfunctions import db_result

# load_dotenv()

# app = FastAPI()

# # Setup OAuth2 dependency from auth module (resolve circular import)
# from fastapi.security import OAuth2PasswordBearer
# auth_router.oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
# # auth_router.get_current_user = auth_router.get_current_user

# origins = ["http://localhost:5173", "http://127.0.0.1:5173"]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# def create_user_table():
#     query_create = """
#     CREATE TABLE IF NOT EXISTS public.users (
#         username VARCHAR(100) NOT NULL,
#         email VARCHAR(255) NOT NULL,
#         password VARCHAR(255) NOT NULL,
#         PRIMARY KEY (username, email)
#     );
#     """
#     db_result(query_create)
#     print("Users table created with composite primary key (username, email).")

# @app.get("/api/me")
# def get_current_user_info(current_user_email: str = Depends(get_current_user)):
#     query = "SELECT username FROM public.users WHERE email = %s"
#     result = db_result(query, (current_user_email,), fetch_results=True)
#     if not result:
#         raise HTTPException(status_code=404, detail="User not found")
#     return {"username": result[0][0]}

# @app.on_event("startup")
# async def startup_event():
#     create_blog_table()
#     insert_sample_blog_posts()
#     create_user_table()

# app.include_router(auth_router)
# app.include_router(posts_router)
# app.include_router(myposts_router)

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
