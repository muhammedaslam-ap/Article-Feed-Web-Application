import { Types } from "mongoose";
import { ArticleModel } from "../models/articleModel";
import { IArticleRepository } from "../interfaces/repositoryInterfaces/articleRepositoryInterface";
import { TArticleInput, TArticlePaginatedResponse, TArticleResponse } from "../types/article";

export class ArticleRepository implements IArticleRepository {
  async createArticle(data: TArticleInput, userId: Types.ObjectId): Promise<TArticleResponse> {
    const created = await ArticleModel.create({ ...data, createdBy: userId });
    return (await ArticleModel.findById(created._id)
      .populate("createdBy", "firstName lastName email")
      .lean<TArticleResponse>())!;
  }

  async updateArticle(id: string, data: Partial<TArticleInput>): Promise<TArticleResponse | null> {
    return ArticleModel.findByIdAndUpdate(id, data, { new: true })
      .populate("createdBy", "firstName lastName email")
      .lean<TArticleResponse>();
  }

  async deleteArticle(id: string): Promise<void> {
    await ArticleModel.findByIdAndDelete(id);
  }

  async findById(id: string): Promise<TArticleResponse | null> {
    return ArticleModel.findById(id)
      .populate("createdBy", "firstName lastName email")
      .lean<TArticleResponse>();
  }

async getArticles(
    page: number,
    pageSize: number,
    filters: { category?: { $in: string[] } | string; $or?: any[] } = {}
  ): Promise<TArticlePaginatedResponse> {
    const query: any = { ...filters };
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      ArticleModel.find(query)
        .populate("createdBy", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean<TArticleResponse[]>(),
      ArticleModel.countDocuments(query),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async likeArticle(articleId: string, userId: Types.ObjectId): Promise<void> {
    await ArticleModel.findByIdAndUpdate(articleId, {
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    });
  }

  async dislikeArticle(articleId: string, userId: Types.ObjectId): Promise<void> {
    await ArticleModel.findByIdAndUpdate(articleId, {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    });
  }

  async blockArticle(articleId: string, userId: Types.ObjectId): Promise<void> {
    await ArticleModel.findByIdAndUpdate(articleId, {
      $addToSet: { blocks: userId },
    });
  }
}