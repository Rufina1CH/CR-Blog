# models.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

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
    tags: List[str]
    image: Optional[str] = None

class PostUpdateSchema(BaseModel):
    title: Optional[str]
    content: Optional[str]
    tags: Optional[List[str]]

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
