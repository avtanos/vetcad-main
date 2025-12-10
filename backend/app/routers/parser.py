from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.article import Article
from app.schemas.article import ArticleResponse, Author
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/articles/", response_model=List[ArticleResponse])
async def get_articles(
    db: Session = Depends(get_db)
):
    articles = db.query(Article).all()
    
    result = []
    for article in articles:
        author = None
        if article.author_name:
            author = Author(
                name=article.author_name,
                avatarUrl=article.author_avatar_url or "https://randomuser.me/api/portraits/lego/1.jpg"
            )
        
        result.append(ArticleResponse(
            id=article.id,
            title=article.title,
            excerpt=article.excerpt,
            image_url=article.image_url or "https://via.placeholder.com/400x300?text=No+Image",
            category=article.category,
            published_date=article.published_date,
            author=author,
            source_url=article.source_url
        ))
    
    return result

