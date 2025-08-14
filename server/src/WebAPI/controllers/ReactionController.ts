import { Router, Request, Response } from "express";
import { IReactionService } from "../../Domain/services/reactions/IReactionService";
import { Reaction } from "../../Domain/models/Reaction";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class ReactionController {
  private router: Router;

  constructor(private reactionService: IReactionService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Kreiranje reakcije - samo student
    this.router.post("/reactions", authenticate, authorize("student"), this.createReaction.bind(this));

    // Dobavljanje reakcija po obaveštenju - svi upisani korisnici
    this.router.get("/reactions/:announcementId", authenticate, this.getByAnnouncement.bind(this));

    // Brisanje reakcije - samo student koji je kreirao
    this.router.delete("/reactions/:id", authenticate, authorize("student"), this.deleteReaction.bind(this));
  }

  private async createReaction(req: Request, res: Response) {
    try {
      const { announcementId, userId, lajkDislajk } = req.body;

      const reaction = await this.reactionService.createReaction(
        new Reaction(0, announcementId, userId, lajkDislajk)
      );

      res.status(201).json(reaction);
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  private async getByAnnouncement(req: Request, res: Response) {
    try {
      const announcementId = Number(req.params.announcementId);
      const reactions = await this.reactionService.getByAnnouncement(announcementId);
      res.status(200).json(reactions);
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  private async deleteReaction(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const success = await this.reactionService.deleteReaction(id);
      res.status(success ? 200 : 400).json({ success });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}