"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectedArticleController = void 0;
// ✅ articleInjection.ts
const articleController_1 = require("../controllers/articleController");
const articleService_1 = require("../services/articleService");
const articleRepository_1 = require("../repository/articleRepository");
// Create repository instance
const articleRepository = new articleRepository_1.ArticleRepository();
// Inject repository into service
const articleService = new articleService_1.ArticleService(articleRepository);
// Inject service into controller
exports.injectedArticleController = new articleController_1.ArticleController(articleService);
