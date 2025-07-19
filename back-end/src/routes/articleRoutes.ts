import { Router, Request, Response } from "express";
import { injectedArticleController } from "../di/articleInjection";
import { userAuthMiddleware, CustomRequest } from "../middlewares/userAuthMiddleware";
import { upload } from "../util/multer";

const asCustomRequest = (req: Request): CustomRequest => req as CustomRequest;

export class ArticleRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/articles", (req: Request, res: Response) => {
      console.log("Fetching articles...");
      injectedArticleController.getArticles(req, res);
    });

    this.router.get("/articles/:articleId", (req: Request, res: Response) =>
      injectedArticleController.getArticleById(req, res)
    );

    this.router.use(userAuthMiddleware);

    this.router.post("/articles", upload.single("image"), (req: Request, res: Response) =>
      injectedArticleController.createArticle(asCustomRequest(req), res)
    );

    this.router.put("/articles/:articleId", upload.single("image"), (req: Request, res: Response) =>
      injectedArticleController.updateArticle(asCustomRequest(req), res)
    );
    
    this.router.delete("/articles/:articleId", (req: Request, res: Response) =>
      injectedArticleController.deleteArticle(asCustomRequest(req), res)
    );

    this.router.post("/articles/:articleId/like", (req: Request, res: Response) =>
      injectedArticleController.likeArticle(asCustomRequest(req), res)
    );

    this.router.post("/articles/:articleId/dislike", (req: Request, res: Response) =>
      injectedArticleController.dislikeArticle(asCustomRequest(req), res)
    );

    this.router.post("/articles/:articleId/block", (req: Request, res: Response) =>
      injectedArticleController.blockArticle(asCustomRequest(req), res)
    );
  }
}