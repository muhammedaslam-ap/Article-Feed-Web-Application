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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleService = void 0;
const custom_error_1 = require("../util/custom.error");
const constant_1 = require("../shared/constant");
const mongoose_1 = __importDefault(require("mongoose"));
class ArticleService {
    constructor(_repo) {
        this._repo = _repo;
    }
    createArticle(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongoose_1.default.Types.ObjectId(userId);
            return this._repo.createArticle(data, objectId);
        });
    }
    updateArticle(articleId, userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield this._repo.findById(articleId);
            if (!article)
                throw new custom_error_1.CustomError(constant_1.ERROR_MESSAGES.ID_NOT_PROVIDED, constant_1.HTTP_STATUS.NOT_FOUND);
            if (String(article.createdBy._id) !== userId) {
                throw new custom_error_1.CustomError("Unauthorized", constant_1.HTTP_STATUS.FORBIDDEN);
            }
            return this._repo.updateArticle(articleId, data);
        });
    }
    deleteArticle(articleId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield this._repo.findById(articleId);
            if (!article)
                throw new custom_error_1.CustomError(constant_1.ERROR_MESSAGES.ID_NOT_PROVIDED, constant_1.HTTP_STATUS.NOT_FOUND);
            if (String(article.createdBy._id) !== userId) {
                throw new custom_error_1.CustomError("Unauthorized", constant_1.HTTP_STATUS.FORBIDDEN);
            }
            yield this._repo.deleteArticle(articleId);
        });
    }
    getArticleById(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield this._repo.findById(articleId);
            if (!article)
                throw new custom_error_1.CustomError(constant_1.ERROR_MESSAGES.ID_NOT_PROVIDED, constant_1.HTTP_STATUS.NOT_FOUND);
            return article;
        });
    }
    getArticles(page, pageSize, categories, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const filters = {};
            if (Array.isArray(categories)) {
                filters["category"] = { $in: categories };
            }
            else if (categories) {
                filters["category"] = categories;
            }
            if (search) {
                filters["$or"] = [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                ];
            }
            return this._repo.getArticles(page, pageSize, filters);
        });
    }
    likeArticle(articleId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongoose_1.default.Types.ObjectId(userId);
            yield this._repo.likeArticle(articleId, objectId);
        });
    }
    dislikeArticle(articleId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongoose_1.default.Types.ObjectId(userId);
            yield this._repo.dislikeArticle(articleId, objectId);
        });
    }
    blockArticle(articleId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongoose_1.default.Types.ObjectId(userId);
            yield this._repo.blockArticle(articleId, objectId);
        });
    }
}
exports.ArticleService = ArticleService;
