import { Router, Request, Response } from "express";
import { ICommentService } from "../../Domain/services/comments/ICommentService";
import { Comment } from "../../Domain/models/Comment";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class CommentController {
  private router: Router;

  constructor(private commentService: ICommentService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Kreiranje komentara
    this.router.post(
      "/comments",
      authenticate,
      authorize("student"),
      this.createComment.bind(this)
    );

    // Dobavljanje komentara po obaveštenju
    this.router.get(
      "/comments/:announcementId",
      authenticate,
      this.getByAnnouncement.bind(this)
    );

    // Brisanje komentara
    this.router.delete(
      "/comments/:id",
      authenticate,
      authorize("student"),
      this.deleteComment.bind(this)
    );

    // Izmena komentara
    this.router.put(
      "/comments/:id",
      authenticate,
      authorize("student"),
      this.updateComment.bind(this)
    );
  }

  private async createComment(req: Request, res: Response) {
    try {
      const { announcementId, authorId, text } = req.body;

      // Validacija
      if (!announcementId || !authorId || !text || text.trim() === "") {
        res.status(400).json({
          success: false,
          message: "Polja announcementId, authorId i text su obavezna.",
        });
        return;
      }

      const comment = await this.commentService.createComment(
        new Comment(0, announcementId, authorId, text)
      );

      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  private async updateComment(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { announcementId, authorId, text } = req.body;

      // Validacija
      if (!text || text.trim() === "") {
        res.status(400).json({
          success: false,
          message: "Polja announcementId, authorId i text su obavezna.",
        });
        return;
      }

      const updated = await this.commentService.updateComment(
        new Comment(id, announcementId, authorId, text)
      );

      if (updated.id === 0) {
        res.status(400).json({ success: false, message: "Ažuriranje nije uspelo." });
      } else {
        res.status(200).json(updated);
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  private async getByAnnouncement(req: Request, res: Response) {
    try {
      const announcementId = Number(req.params.announcementId);
      const comments = await this.commentService.getByAnnouncement(announcementId);
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  private async deleteComment(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const success = await this.commentService.deleteComment(id);
      res.status(success ? 200 : 400).json({ success });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
