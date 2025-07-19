import { TArticleInput, TArticleResponse, TArticlePaginatedResponse } from "../../types/article";

export interface IArticleService {
  getArticles(
    page: number,
    pageSize: number,
    categories?: string[] | string,
    search?: string
  ): Promise<TArticlePaginatedResponse>;

  getArticleById(articleId: string): Promise<TArticleResponse>;
  createArticle(userId: string, data: TArticleInput): Promise<TArticleResponse>;
  updateArticle(articleId: string, userId: string, data: Partial<TArticleInput>): Promise<TArticleResponse>;
  deleteArticle(articleId: string, userId: string): Promise<void>;
  likeArticle(articleId: string, userId: string): Promise<void>;
  dislikeArticle(articleId: string, userId: string): Promise<void>;
  blockArticle(articleId: string, userId: string): Promise<void>;
}