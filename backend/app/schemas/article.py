from pydantic import BaseModel
from typing import Optional
from datetime import date


class Author(BaseModel):
    name: str
    avatarUrl: str


class ArticleResponse(BaseModel):
    id: int
    title: str
    excerpt: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    published_date: Optional[date] = None
    author: Optional[Author] = None
    source_url: Optional[str] = None

    class Config:
        from_attributes = True

