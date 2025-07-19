// ✅ article.types.ts
import { Types } from "mongoose";

export type TArticleResponse = {
  _id: Types.ObjectId | string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  images: string[];
  createdBy: {
    _id: Types.ObjectId | string;
    firstName: string;
    lastName: string;
    email: string;
  };
  likes: Types.ObjectId[] | string[];
  dislikes: Types.ObjectId[] | string[];
  blocks: Types.ObjectId[] | string[];
  createdAt: Date;
  updatedAt: Date;
};

export type TArticlePaginatedResponse = {
  data: TArticleResponse[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type TArticleInput = {
  title: string;
  description: string;
  category: string;
  tags?: string[];
  images?: string[];
};

