from sqlalchemy import Column, Integer, String, Text, Date
from app.database import Base


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    excerpt = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    category = Column(String, nullable=True)
    published_date = Column(Date, nullable=True)
    author_name = Column(String, nullable=True)
    author_avatar_url = Column(String, nullable=True)
    source_url = Column(String, nullable=True)
    content = Column(Text, nullable=True)

