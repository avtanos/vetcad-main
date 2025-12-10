export interface Author {
    name: string;
    avatarUrl: string;
  }
  
  export interface Article {
    id: string;
    title: string;
    excerpt: string;
    imageUrl: string;
    category: string;
    publishedDate: string;
    author: Author;
    sourceUrl: string; 
  }

