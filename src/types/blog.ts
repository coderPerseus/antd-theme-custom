export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published' | 'archived';
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface BlogSettings {
  siteName: string;
  siteDescription: string;
  author: string;
  email: string;
  theme: 'light' | 'dark';
}
