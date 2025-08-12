"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectedArticleController = void 0;
const articleController_1 = require("../controllers/articleController");
const articleService_1 = require("../services/articleService");
const articleRepository_1 = require("../repository/articleRepository");
const articleRepository = new articleRepository_1.ArticleRepository();
const articleService = new articleService_1.ArticleService(articleRepository);
exports.injectedArticleController = new articleController_1.ArticleController(articleService);
