# myposts.py
import base64
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from models import BlogPost, PostUpdate
from auth import get_current_user
from dbfunctions import db_result

router = APIRouter()

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

@router.get("/api/myposts")
def get_my_posts(current_user: str = Depends(get_current_user)):
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

    return formatted_posts

@router.post("/api/posts")
def create_post(post: BlogPost, current_user_email: str = Depends(get_current_user)):
    author = get_author(current_user_email)

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
        author,
        created_at_dt,
        post.content,
        post.tags,
        image_bytes
    ))
    return {"message": "Post created successfully", "id": post.id}

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
