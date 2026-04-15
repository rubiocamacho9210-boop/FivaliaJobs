export type UserSummary = {
  id: string;
  name: string;
  role: 'CLIENT' | 'WORKER';
  rating: number;
  ratingCount: number;
};

export type Profile = {
  id: string;
  userId: string;
  bio: string | null;
  category: string | null;
  location: string | null;
  contact: string | null;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  user: UserSummary;
};

export type UpdateProfileRequest = {
  bio?: string;
  category?: string;
  location?: string;
  contact?: string;
  photoUrl?: string | null;
};
