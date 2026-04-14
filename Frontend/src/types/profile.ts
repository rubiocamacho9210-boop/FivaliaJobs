export type UserSummary = {
  id: string;
  name: string;
  role: 'CLIENT' | 'WORKER';
};

export type Profile = {
  id: string;
  userId: string;
  bio: string | null;
  category: string | null;
  location: string | null;
  contact: string | null;
  createdAt: string;
  updatedAt: string;
  user: UserSummary;
};

export type UpdateProfileRequest = {
  bio?: string;
  category?: string;
  location?: string;
  contact?: string;
};
