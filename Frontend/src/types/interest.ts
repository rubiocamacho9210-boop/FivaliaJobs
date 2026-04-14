import { PostType, PostStatus } from '@/types/post';

export type Interest = {
  id: string;
  fromUserId: string;
  postId: string;
  createdAt: string;
};

export type InterestWithPost = Interest & {
  post: {
    id: string;
    title: string;
    type: PostType;
    category: string;
    status: PostStatus;
    user: {
      id: string;
      name: string;
    };
  };
};

export type InterestWithFromUser = Interest & {
  fromUser: {
    id: string;
    name: string;
    role: 'CLIENT' | 'WORKER';
  };
};

export type CreateInterestRequest = {
  postId: string;
};
