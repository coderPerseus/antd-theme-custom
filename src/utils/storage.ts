import type { BlogPost, BlogSettings } from '../types/blog';

const STORAGE_KEYS = {
  POSTS: 'blog_posts',
  SETTINGS: 'blog_settings',
  CATEGORIES: 'blog_categories',
} as const;

// 博客文章存储
export const blogStorage = {
  getPosts: (): BlogPost[] => {
    const data = localStorage.getItem(STORAGE_KEYS.POSTS);
    return data ? JSON.parse(data) : [];
  },

  savePosts: (posts: BlogPost[]) => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  },

  addPost: (post: BlogPost) => {
    const posts = blogStorage.getPosts();
    posts.unshift(post);
    blogStorage.savePosts(posts);
  },

  updatePost: (id: string, updatedPost: Partial<BlogPost>) => {
    const posts = blogStorage.getPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updatedPost, updatedAt: new Date().toISOString() };
      blogStorage.savePosts(posts);
    }
  },

  deletePost: (id: string) => {
    const posts = blogStorage.getPosts();
    const filtered = posts.filter((p) => p.id !== id);
    blogStorage.savePosts(filtered);
  },

  getPostById: (id: string): BlogPost | undefined => {
    const posts = blogStorage.getPosts();
    return posts.find((p) => p.id === id);
  },
};

// 博客设置存储
export const settingsStorage = {
  getSettings: (): BlogSettings => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data
      ? JSON.parse(data)
      : {
          siteName: 'Antd Theme Blog',
          siteDescription: '一个用于测试 Antd 主题的博客平台',
          author: 'Admin',
          email: 'admin@example.com',
          theme: 'light',
        };
  },

  saveSettings: (settings: BlogSettings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },
};

// 初始化示例数据
export const initializeSampleData = () => {
  const posts = blogStorage.getPosts();
  if (posts.length === 0) {
    const samplePosts: BlogPost[] = [
      {
        id: '1',
        title: '欢迎使用 Antd Theme Blog',
        content: '这是一个完整的博客管理平台，用于展示 Antd 所有组件在不同主题下的表现。',
        summary: '介绍 Antd Theme Blog 平台的功能和特点',
        author: 'Admin',
        tags: ['介绍', 'Antd', '主题'],
        category: '系统',
        status: 'published',
        createdAt: new Date('2025-01-01').toISOString(),
        updatedAt: new Date('2025-01-01').toISOString(),
        views: 128,
        likes: 24,
      },
      {
        id: '2',
        title: 'Antd 组件库完整体验',
        content: '本平台集成了 Antd 的所有主要组件，包括表单、表格、导航、反馈等各类组件。',
        summary: '展示平台中使用的各类 Antd 组件',
        author: 'Admin',
        tags: ['组件', 'UI', 'Antd'],
        category: '技术',
        status: 'published',
        createdAt: new Date('2025-01-05').toISOString(),
        updatedAt: new Date('2025-01-05').toISOString(),
        views: 96,
        likes: 18,
      },
      {
        id: '3',
        title: '主题切换功能使用指南',
        content: '点击右上角的主题切换按钮，可以在明亮模式和暗黑模式之间切换，所有组件都会自动适配。',
        summary: '如何使用主题切换功能',
        author: 'Admin',
        tags: ['主题', '教程'],
        category: '使用指南',
        status: 'draft',
        createdAt: new Date('2025-01-10').toISOString(),
        updatedAt: new Date('2025-01-10').toISOString(),
        views: 52,
        likes: 8,
      },
    ];
    blogStorage.savePosts(samplePosts);
  }
};
