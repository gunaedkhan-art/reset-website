export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  readingTimeMinutes: number;
  featured?: boolean;
  draft?: boolean;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

export interface BlogCategory {
  slug: string;
  name: string;
  description: string;
}
