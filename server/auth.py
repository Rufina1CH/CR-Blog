# auth.py
import os
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from passlib.hash import bcrypt
from jose import jwt, JWTError
from dotenv import load_dotenv
from psycopg2 import IntegrityError
from dbfunctions import db_result
from models import UserRegister, UserLogin

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET", "mysecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

oauth2_scheme = None  # Will be set in main.py (circular import workaround)

# def get_current_user(token: str = Depends(lambda: None)):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email: str = payload.get("sub")
#         if email is None:
#             raise HTTPException(status_code=401, detail="Invalid token")
#         return email
#     except JWTError:
#         raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/register")
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

@router.post("/login")
def login(data: UserLogin):
    email = data.email.strip().lower()
    password = data.password

    query = "SELECT username, email, password FROM public.users WHERE LOWER(email) = %s;"
    result = db_result(query, (email,), fetch_results=True)

    if not result:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    username, user_email, hashed_password = result[0]

    if isinstance(hashed_password, bytes):
        hashed_password = hashed_password.decode('utf-8')

    if not bcrypt.verify(password, hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = jwt.encode({"sub": user_email}, SECRET_KEY, algorithm=ALGORITHM)
    return {"token": token}
