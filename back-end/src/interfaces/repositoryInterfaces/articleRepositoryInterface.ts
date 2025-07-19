import { TArticleInput, TArticleResponse, TArticlePaginatedResponse } from "../../types/article";
import { Types } from "mongoose";

export interface IArticleRepository {
  createArticle(data: TArticleInput, userId: Types.ObjectId): Promise<TArticleResponse>;
  updateArticle(id: string, data: Partial<TArticleInput>): Promise<TArticleResponse | null>;
  deleteArticle(id: string): Promise<void>;
  findById(id: string): Promise<TArticleResponse | null>;
  getArticles(
    page: number,
    pageSize: number,
    filters?: { category?: string; search?: string }
  ): Promise<TArticlePaginatedResponse>;
  likeArticle(articleId: string, userId: Types.ObjectId): Promise<void>;
  dislikeArticle(articleId: string, userId: Types.ObjectId): Promise<void>;
  blockArticle(articleId: string, userId: Types.ObjectId): Promise<void>;
}
