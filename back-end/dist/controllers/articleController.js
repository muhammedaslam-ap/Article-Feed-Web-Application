"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleController = void 0;
const custom_error_1 = require("../util/custom.error");
const constant_1 = require("../shared/constant");
class ArticleController {
    constructor(_articleService) {
        this._articleService = _articleService;
    }
    createArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { title, description, category } = req.body;
                const tags = JSON.parse(req.body.tags);
                if (!req.file) {
                    throw new Error("Image file is required");
                }
                const articleData = {
                    title,
                    description,
                    category,
                    tags,
                    images: [req.file.filename],
                };
                const article = yield this._articleService.createArticle(userId, articleData);
                res.status(201).json({ success: true, article });
            }
            catch (error) {
                console.error("[ArticleController] Unexpected Error:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    updateArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const articleId = req.params.articleId;
                const { title, description, category, tags } = req.body;
                console.log("Received req.body:", req.body); // Debug body
                console.log("Received req.file:", req.file); // Debug file
                const image = req.file;
                const removeImages = req.body.removeImages === "true";
                // Validate user ownership
                const existingArticle = yield this._articleService.getArticleById(articleId);
                if (!existingArticle) {
                    throw new custom_error_1.CustomError("Unauthorized: You can only edit your own articles.", constant_1.HTTP_STATUS.FORBIDDEN);
                }
                // Handle tags
                let parsedTags = existingArticle.tags || [];
                if (tags !== undefined && tags !== null) {
                    if (typeof tags === "string") {
                        try {
                            parsedTags = JSON.parse(tags);
                            if (!Array.isArray(parsedTags))
                                throw new Error("Invalid JSON format for tags");
                        }
                        catch (e) {
                            parsedTags = tags.split(",").map((tag) => tag.trim());
                        }
                    }
                    else if (Array.isArray(tags)) {
                        parsedTags = tags.map((tag) => (typeof tag === "string" ? tag.trim() : String(tag).trim()));
                    }
                    else {
                        throw new Error("Tags must be a string or array");
                    }
                }
                const updateData = {
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
                }
                else if (removeImages) {
                    updateData.images = []; // Remove image reference without deleting file
                }
                else {
                    updateData.images = existingArticle.images; // Keep existing images if no change
                }
                const article = yield this._articleService.updateArticle(articleId, userId, updateData);
                res.status(constant_1.HTTP_STATUS.OK).json({ success: true, article });
            }
            catch (error) {
                this.handleError(error, res);
            }
        });
    }
    deleteArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const articleId = req.params.articleId;
                yield this._articleService.deleteArticle(articleId, userId);
                res.status(constant_1.HTTP_STATUS.OK).send();
            }
            catch (error) {
                this.handleError(error, res);
            }
        });
    }
    getArticleById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const articleId = req.params.articleId;
                const article = yield this._articleService.getArticleById(articleId);
                console.log("hellololoolo", article);
                res.status(constant_1.HTTP_STATUS.OK).json({ success: true, article });
            }
            catch (error) {
                this.handleError(error, res);
            }
        });
    }
    getArticles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("hello");
                const { page = 1, pageSize = 10, category, categories, search } = req.query;
                console.log("suiuiuiuiiuiiuiu", search);
                const pageNum = Number(page);
                const pageSizeNum = Number(pageSize);
                const categoryFilter = category ? [category] : undefined;
                const categoriesFilter = categories ? categories.split(',') : undefined; // Split comma-separated string into array
                const searchFilter = search ? search : undefined;
                const result = yield this._articleService.getArticles(pageNum, pageSizeNum, categoriesFilter || categoryFilter, // Use categories array or single category
                searchFilter);
                res.status(constant_1.HTTP_STATUS.OK).json(Object.assign({ success: true }, result));
            }
            catch (error) {
                this.handleError(error, res);
            }
        });
    }
    likeArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const articleId = req.params.articleId;
                const userId = req.user.id;
                yield this._articleService.likeArticle(articleId, userId);
                res.status(constant_1.HTTP_STATUS.OK).json({ success: true });
            }
            catch (error) {
                this.handleError(error, res);
            }
        });
    }
    dislikeArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const articleId = req.params.articleId;
                const userId = req.user.id;
                yield this._articleService.dislikeArticle(articleId, userId);
                res.status(constant_1.HTTP_STATUS.OK).json({ success: true });
            }
            catch (error) {
                this.handleError(error, res);
            }
        });
    }
    blockArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const articleId = req.params.articleId;
                const userId = req.user.id;
                yield this._articleService.blockArticle(articleId, userId);
                res.status(constant_1.HTTP_STATUS.OK).json({ success: true });
            }
            catch (error) {
                this.handleError(error, res);
            }
        });
    }
    handleError(error, res) {
        if (error instanceof custom_error_1.CustomError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
        }
        else {
            console.error("[ArticleController] Unexpected Error:", error);
            res.status(constant_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: "Something went wrong" });
        }
    }
}
exports.ArticleController = ArticleController;
