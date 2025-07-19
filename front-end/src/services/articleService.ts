import axios, { AxiosInstance } from "axios";
import { authAxiosInstance } from "../api/authAxiosInstance";
import {  TArticlePaginatedResponse, TArticleResponse, TGetArticleResponse } from "../types/article"; // Adjust path based on your project structure

export class ArticleService {
  private httpClient: AxiosInstance;

  constructor(httpClient: AxiosInstance = authAxiosInstance) {
    this.httpClient = httpClient;
  }

  private initializeRoutes() {
    return {
      getArticles: this.getArticles.bind(this),
      getArticleById: this.getArticleById.bind(this),
      createArticle: this.createArticle.bind(this),
      updateArticle: this.updateArticle.bind(this),
      deleteArticle: this.deleteArticle.bind(this),
      likeArticle: this.likeArticle.bind(this),
      dislikeArticle: this.dislikeArticle.bind(this),
      blockArticle: this.blockArticle.bind(this),
    };
  }

 async getArticles(page: number = 1, pageSize: number = 10, categories?: string[] | string, search?: string) {
    try {
      const params = { page, pageSize, categories: Array.isArray(categories) ? categories.join(',') : categories, search };
      const response = await this.httpClient.get<TArticlePaginatedResponse>("/articles", { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch articles");
      }
      throw new Error("Unexpected error while fetching articles");
    }
  }

  async getArticleById(articleId: string) {
    try {
      const response = await this.httpClient.get<TGetArticleResponse>(`/articles/${articleId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch article");
      }
      throw new Error("Unexpected error while fetching article");
    }
  }

  async createArticle(data: FormData) {
    try {
      const response = await this.httpClient.post("/articles", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to create article"
        );
      }
      throw new Error("Unexpected error while creating article");
    }
  }

  async updateArticle(articleId: string, data: FormData) {
    try {
      const response = await this.httpClient.put<TArticleResponse>(`/articles/${articleId}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to update article");
      }
      throw new Error("Unexpected error while updating article");
    }
  }

  async deleteArticle(articleId: string) {
    try {
      const response = await this.httpClient.delete(`/articles/${articleId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to delete article");
      }
      throw new Error("Unexpected error while deleting article");
    }
  }

  async likeArticle(articleId: string) {
    try {
      const response = await this.httpClient.post(`/articles/${articleId}/like`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to like article");
      }
      throw new Error("Unexpected error while liking article");
    }
  }

  async dislikeArticle(articleId: string) {
    try {
      const response = await this.httpClient.post(`/articles/${articleId}/dislike`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to dislike article");
      }
      throw new Error("Unexpected error while disliking article");
    }
  }

  async blockArticle(articleId: string) {
    try {
      const response = await this.httpClient.post(`/articles/${articleId}/block`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to block article");
      }
      throw new Error("Unexpected error while blocking article");
    }
  }

  // Export the "routes" for use
  public routes = this.initializeRoutes();
}

// Export a default instance with dependency injection
export const articleService = new ArticleService();