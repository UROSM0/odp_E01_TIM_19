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
    
    this.router.post("/reactions", authenticate, authorize("student"), this.toggleReaction.bind(this));

    
    this.router.get("/reactions/:announcementId", authenticate, this.getByAnnouncement.bind(this));

    
    this.router.delete("/reactions/:id", authenticate, authorize("student"), this.deleteReaction.bind(this));
  }

  private async toggleReaction(req: Request, res: Response) {
    try {
      const { announcementId, userId, lajkDislajk } = req.body;

      if (!announcementId || !userId || !lajkDislajk) {
        return res.status(400).json({ success: false, message: "Polja announcementId, userId i lajkDislajk su obavezna." });
      }

      
      const reactions = await this.reactionService.getByAnnouncement(announcementId);
      const existing = reactions.find(r => r.userId === userId);

      if (existing) {
        if (existing.lajkDislajk === lajkDislajk) {
         
          await this.reactionService.deleteReaction(existing.id);
          return res.status(200).json({ success: true, action: "deleted" });
        } else {
          
          await this.reactionService.deleteReaction(existing.id); 
          const newReaction = await this.reactionService.createReaction(new Reaction(0, announcementId, userId, lajkDislajk));
          return res.status(200).json({ success: true, action: "updated", reaction: newReaction });
        }
      } else {
        
        const newReaction = await this.reactionService.createReaction(new Reaction(0, announcementId, userId, lajkDislajk));
        return res.status(201).json({ success: true, action: "created", reaction: newReaction });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error });
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
