// ✅ articleInjection.ts
import { ArticleController } from "../controllers/articleController";
import { ArticleService } from "../services/articleService";
import { ArticleRepository } from "../repository/articleRepository";

// Create repository instance
const articleRepository = new ArticleRepository();

// Inject repository into service
const articleService = new ArticleService(articleRepository);

// Inject service into controller
export const injectedArticleController = new ArticleController(articleService);
