"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleRoutes = void 0;
const express_1 = require("express");
const articleInjection_1 = require("../di/articleInjection");
const userAuthMiddleware_1 = require("../middlewares/userAuthMiddleware");
const multer_1 = require("../util/multer");
const asCustomRequest = (req) => req;
class ArticleRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/articles", (req, res) => {
            console.log("Fetching articles...");
            articleInjection_1.injectedArticleController.getArticles(req, res);
        });
        this.router.get("/articles/:articleId", (req, res) => articleInjection_1.injectedArticleController.getArticleById(req, res));
        this.router.use(userAuthMiddleware_1.userAuthMiddleware);
        this.router.post("/articles", multer_1.upload.single("image"), (req, res) => articleInjection_1.injectedArticleController.createArticle(asCustomRequest(req), res));
        this.router.put("/articles/:articleId", multer_1.upload.single("image"), (req, res) => articleInjection_1.injectedArticleController.updateArticle(asCustomRequest(req), res));
        this.router.delete("/articles/:articleId", (req, res) => articleInjection_1.injectedArticleController.deleteArticle(asCustomRequest(req), res));
        this.router.post("/articles/:articleId/like", (req, res) => articleInjection_1.injectedArticleController.likeArticle(asCustomRequest(req), res));
        this.router.post("/articles/:articleId/dislike", (req, res) => articleInjection_1.injectedArticleController.dislikeArticle(asCustomRequest(req), res));
        this.router.post("/articles/:articleId/block", (req, res) => articleInjection_1.injectedArticleController.blockArticle(asCustomRequest(req), res));
    }
}
exports.ArticleRoutes = ArticleRoutes;
