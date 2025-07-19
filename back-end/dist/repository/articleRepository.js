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
exports.ArticleRepository = void 0;
const articleModel_1 = require("../models/articleModel");
class ArticleRepository {
    createArticle(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield articleModel_1.ArticleModel.create(Object.assign(Object.assign({}, data), { createdBy: userId }));
            return (yield articleModel_1.ArticleModel.findById(created._id)
                .populate("createdBy", "firstName lastName email")
                .lean());
        });
    }
    updateArticle(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return articleModel_1.ArticleModel.findByIdAndUpdate(id, data, { new: true })
                .populate("createdBy", "firstName lastName email")
                .lean();
        });
    }
    deleteArticle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield articleModel_1.ArticleModel.findByIdAndDelete(id);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return articleModel_1.ArticleModel.findById(id)
                .populate("createdBy", "firstName lastName email")
                .lean();
        });
    }
    getArticles(page_1, pageSize_1) {
        return __awaiter(this, arguments, void 0, function* (page, pageSize, filters = {}) {
            const query = Object.assign({}, filters);
            const skip = (page - 1) * pageSize;
            const [data, total] = yield Promise.all([
                articleModel_1.ArticleModel.find(query)
                    .populate("createdBy", "firstName lastName email")
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(pageSize)
                    .lean(),
                articleModel_1.ArticleModel.countDocuments(query),
            ]);
            return {
                data,
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            };
        });
    }
    likeArticle(articleId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield articleModel_1.ArticleModel.findByIdAndUpdate(articleId, {
                $addToSet: { likes: userId },
                $pull: { dislikes: userId },
            });
        });
    }
    dislikeArticle(articleId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield articleModel_1.ArticleModel.findByIdAndUpdate(articleId, {
                $addToSet: { dislikes: userId },
                $pull: { likes: userId },
            });
        });
    }
    blockArticle(articleId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield articleModel_1.ArticleModel.findByIdAndUpdate(articleId, {
                $addToSet: { blocks: userId },
            });
        });
    }
}
exports.ArticleRepository = ArticleRepository;
