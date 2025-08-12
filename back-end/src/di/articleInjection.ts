import { ArticleController } from "../controllers/articleController";
import { ArticleService } from "../services/articleService";
import { ArticleRepository } from "../repository/articleRepository";

const articleRepository = new ArticleRepository();

const articleService = new ArticleService(articleRepository);

export const injectedArticleController = new ArticleController(articleService);
