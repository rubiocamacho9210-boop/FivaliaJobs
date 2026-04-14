export type PostType = 'NEED' | 'OFFER';
export type PostStatus = 'ACTIVE' | 'CLOSED';

export type PostAuthor = {
  id: string;
  name: string;
  role?: 'CLIENT' | 'WORKER';
  profile?: {
    location: string | null;
    contact: string | null;
  } | null;
};

export type Post = {
  id: string;
  userId: string;
  type: PostType;
  title: string;
  description: string;
  category: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  user?: PostAuthor;
};

export type CreatePostRequest = {
  type: PostType;
  title: string;
  description: string;
  category: string;
};
