import { IArticleService } from "../interfaces/serviceInterfaces/articleServiceInterface";
import { IArticleRepository } from "../interfaces/repositoryInterfaces/articleRepositoryInterface";
import { TArticleInput, TArticleResponse, TArticlePaginatedResponse } from "../types/article";
import { CustomError } from "../util/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../shared/constant";
import mongoose from "mongoose";

export class ArticleService implements IArticleService {
  constructor(private readonly _repo: IArticleRepository) {}


    async createArticle(userId: string, data: TArticleInput): Promise<TArticleResponse> {
      const objectId = new mongoose.Types.ObjectId(userId); 
      return this._repo.createArticle(data, objectId);
    }

    async updateArticle(articleId: string, userId: string, data: Partial<TArticleInput>): Promise<TArticleResponse> {
      const article = await this._repo.findById(articleId);
      if (!article) throw new CustomError(ERROR_MESSAGES.ID_NOT_PROVIDED, HTTP_STATUS.NOT_FOUND);
      if (String(article.createdBy._id) !== userId) {
        throw new CustomError("Unauthorized", HTTP_STATUS.FORBIDDEN);
      }
      return this._repo.updateArticle(articleId, data) as Promise<TArticleResponse>;
    }

  async deleteArticle(articleId: string, userId: string): Promise<void> {
    const article = await this._repo.findById(articleId);
    if (!article) throw new CustomError(ERROR_MESSAGES.ID_NOT_PROVIDED, HTTP_STATUS.NOT_FOUND);
    if (String(article.createdBy._id) !== userId) {
      throw new CustomError("Unauthorized", HTTP_STATUS.FORBIDDEN);
    }
    await this._repo.deleteArticle(articleId);
  }

  async getArticleById(articleId: string): Promise<TArticleResponse> {
    const article = await this._repo.findById(articleId);
    if (!article) throw new CustomError(ERROR_MESSAGES.ID_NOT_PROVIDED, HTTP_STATUS.NOT_FOUND);
    return article;
  }

 async getArticles(
    page: number,
    pageSize: number,
    categories?: string[] | string,
    search?: string
  ): Promise<TArticlePaginatedResponse> {
    const filters: { [key: string]: any } = {}; 
    if (Array.isArray(categories)) {
      filters["category"] = { $in: categories }; 
    } else if (categories) {
      filters["category"] = categories; 
    }
    if (search) {
      filters["$or"] = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    return this._repo.getArticles(page, pageSize, filters);
  }
  async likeArticle(articleId: string, userId: string): Promise<void> {
    const objectId = new mongoose.Types.ObjectId(userId); 
    await this._repo.likeArticle(articleId, objectId);
  }

  async dislikeArticle(articleId: string, userId: string): Promise<void> {
    const objectId = new mongoose.Types.ObjectId(userId); 
    await this._repo.dislikeArticle(articleId, objectId);
  }

  async blockArticle(articleId: string, userId: string): Promise<void> {
    const objectId = new mongoose.Types.ObjectId(userId); 
    await this._repo.blockArticle(articleId, objectId);
  }
}