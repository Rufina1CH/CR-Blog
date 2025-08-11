# posts.py
import base64
from fastapi import APIRouter, HTTPException
from dbfunctions import db_result

router = APIRouter()

@router.get("/api/posts")
def get_posts():
    query = """
        SELECT postid, title, author, createdat, content, tags, image, isdeleted
        FROM public.blog
        WHERE isdeleted = FALSE OR isdeleted IS NULL
        ORDER BY createdat DESC;
    """
    rows = db_result(query, fetch_results=True)

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
    return posts


@router.get("/api/posts/{postid}")
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
