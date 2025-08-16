import { Router, Request, Response } from "express";
import { IAnnouncementService } from "../../Domain/services/announcements/IAnnouncementService";
import { Announcement } from "../../Domain/models/Announcement";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class AnnouncementController {
  private router: Router;

  constructor(private announcementService: IAnnouncementService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Kreiranje obaveštenja - samo profesor može
    this.router.post(
      "/announcements",
      authenticate,
      authorize("professor"),
      this.createAnnouncement.bind(this)
    );

    // Dobavljanje obaveštenja po kursu - svi upisani korisnici mogu
    this.router.get("/announcements/:courseId", authenticate, this.getByCourse.bind(this));

    // Ažuriranje obaveštenja - samo profesor
    this.router.put(
      "/announcements/:id",
      authenticate,
      authorize("professor"),
      this.updateAnnouncement.bind(this)
    );

    // Brisanje obaveštenja - samo profesor
    this.router.delete(
      "/announcements/:id",
      authenticate,
      authorize("professor"),
      this.deleteAnnouncement.bind(this)
    );
  }

  private async createAnnouncement(req: Request, res: Response) {
    try {
      const { courseId, authorId, text, imageUrl } = req.body;

      // Validacija
      if (!courseId || !authorId || !text || text.trim() === "") {
        res.status(400).json({ success: false, message: "Polja courseId, authorId i text su obavezna." });
        return;
      }

      const announcement = await this.announcementService.createAnnouncement(
        new Announcement(0, courseId, authorId, text, imageUrl)
      );

      res.status(201).json(announcement);
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

private async updateAnnouncement(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { courseId, authorId, text, imageUrl } = req.body;

    // Validacija
    if (!text || text.trim() === "") {
      res.status(400).json({ success: false, message: "Polje text je obavezno." });
      return;
    }

    if (!courseId || !authorId) {
      res.status(400).json({ success: false, message: "Polja courseId i authorId su obavezna." });
      return;
    }

    // Kreiranje Announcement objekta
    const announcementToUpdate = new Announcement(id, courseId, authorId, text, imageUrl);

    const updated = await this.announcementService.updateAnnouncement(announcementToUpdate);

    if (updated.id === 0) {
      res.status(400).json({ success: false, message: "Ažuriranje nije uspelo." });
    } else {
      res.status(200).json(updated);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
}


  private async getByCourse(req: Request, res: Response) {
    try {
      const courseId = Number(req.params.courseId);
      const announcements = await this.announcementService.getByCourse(courseId);
      res.status(200).json(announcements);
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  private async deleteAnnouncement(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const success = await this.announcementService.deleteAnnouncement(id);
      res.status(success ? 200 : 400).json({ success });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
