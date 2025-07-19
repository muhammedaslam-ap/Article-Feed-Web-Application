  // ✅ articleController.ts
import { Request, Response } from "express";
import { IArticleService } from "../interfaces/serviceInterfaces/articleServiceInterface";
import { TArticleInput } from "../types/article";
import { CustomError } from "../util/custom.error";
import { HTTP_STATUS } from "../shared/constant";
import { CustomRequest } from "../middlewares/userAuthMiddleware";
import path from "path";
import fs  from "fs";

export class ArticleController {
  constructor(private _articleService: IArticleService) {}

 async createArticle(req: CustomRequest, res: Response) {
  try {
    const userId = req.user.id;
    const { title, description, category } = req.body;
  const tags = JSON.parse(req.body.tags); 

    if (!req.file) {
      throw new Error("Image file is required");
    }


    const articleData: TArticleInput = {
      title,
      description,
      category,
      tags,
      images:[req.file.filename], 
    };

    const article = await this._articleService.createArticle(userId,articleData);
    res.status(201).json({ success: true, article });
  } catch (error) {
    console.error("[ArticleController] Unexpected Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

 
async updateArticle(req: CustomRequest, res: Response) {
  try {
    const userId = req.user.id;
    const articleId = req.params.articleId;
    const { title, description, category, tags } = req.body;
    console.log("Received req.body:", req.body); // Debug body
    console.log("Received req.file:", req.file); // Debug file
    const image = req.file;
    const removeImages = req.body.removeImages === "true";

    // Validate user ownership
    const existingArticle = await this._articleService.getArticleById(articleId);
    if (!existingArticle) {
      throw new CustomError("Unauthorized: You can only edit your own articles.", HTTP_STATUS.FORBIDDEN);
    }

    // Handle tags
    let parsedTags: string[] = existingArticle.tags || [];
    if (tags !== undefined && tags !== null) {
      if (typeof tags === "string") {
        try {
          parsedTags = JSON.parse(tags);
          if (!Array.isArray(parsedTags)) throw new Error("Invalid JSON format for tags");
        } catch (e) {
          parsedTags = tags.split(",").map((tag) => tag.trim());
        }
      } else if (Array.isArray(tags)) {
        parsedTags = tags.map((tag) => (typeof tag === "string" ? tag.trim() : String(tag).trim()));
      } else {
        throw new Error("Tags must be a string or array");
      }
    }

    const updateData: Partial<TArticleInput> = {
      title: title || existingArticle.title,
      description: description || existingArticle.description,
      category: category || existingArticle.category,
      tags: parsedTags.length > 0 ? parsedTags : existingArticle.tags,
    };

    // Handle image update (no deletion of old images)
    if (image) {
      console.log("Processing new image:", image.filename); // Debug new image
      if (!existingArticle.images || existingArticle.images.length === 0) {
        throw new Error("No existing image to replace; upload is required for new articles.");
      }
      updateData.images = [image.filename]; // Update with new image filename only
    } else if (removeImages) {
      updateData.images = []; // Remove image reference without deleting file
    } else {
      updateData.images = existingArticle.images; // Keep existing images if no change
    }

    const article = await this._articleService.updateArticle(articleId, userId, updateData);
    res.status(HTTP_STATUS.OK).json({ success: true, article });
  } catch (error) {
    this.handleError(error, res);
  }
}

  async deleteArticle(req: CustomRequest, res: Response) {
    try {
      const userId = req.user.id;
      const articleId = req.params.articleId;
      await this._articleService.deleteArticle(articleId, userId);
      res.status(HTTP_STATUS.OK).send();
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getArticleById(req: Request, res: Response) {
    try {
      const articleId = req.params.articleId;
      const article = await this._articleService.getArticleById(articleId);

      console.log("hellololoolo",article)
      res.status(HTTP_STATUS.OK).json({ success: true, article });
    } catch (error) {
      this.handleError(error, res);
    }
  }

async getArticles(req: Request, res: Response) {
    try {
      console.log("hello");
      const { page = 1, pageSize = 10, category, categories, search } = req.query;
      console.log("suiuiuiuiiuiiuiu", search);

      const pageNum = Number(page);
      const pageSizeNum = Number(pageSize);
      const categoryFilter = category ? [category as string] : undefined;
      const categoriesFilter = categories ? (categories as string).split(',') : undefined; // Split comma-separated string into array
      const searchFilter = search ? (search as string) : undefined;

      const result = await this._articleService.getArticles(
        pageNum,
        pageSizeNum,
        categoriesFilter || categoryFilter, // Use categories array or single category
        searchFilter
      );
      res.status(HTTP_STATUS.OK).json({ success: true, ...result });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async likeArticle(req: CustomRequest, res: Response) {
    try {
      const articleId = req.params.articleId;
      const userId = req.user.id;
      await this._articleService.likeArticle(articleId, userId);
      res.status(HTTP_STATUS.OK).json({ success: true });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async dislikeArticle(req: CustomRequest, res: Response) {
    try {
      const articleId = req.params.articleId;
      const userId = req.user.id;
      await this._articleService.dislikeArticle(articleId, userId);
      res.status(HTTP_STATUS.OK).json({ success: true });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async blockArticle(req: CustomRequest, res: Response) {
    try {
      const articleId = req.params.articleId;
      const userId = req.user.id;
      await this._articleService.blockArticle(articleId, userId);
      res.status(HTTP_STATUS.OK).json({ success: true });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: any, res: Response) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
    } else {
      console.error("[ArticleController] Unexpected Error:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: "Something went wrong" });
    }
  }
}
