import { Router, Request, Response } from "express";
import { IAnnouncementService } from "../../Domain/services/announcements/IAnnouncementService";
import { Announcement } from "../../Domain/models/Announcement";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import multer from "multer";
import path from "path";
import fs from "fs";

// Folder za slike
const imagesFolder = path.join(__dirname, "../../public/images/announcements");
if (!fs.existsSync(imagesFolder)) {
  fs.mkdirSync(imagesFolder, { recursive: true });
}

// Konfiguracija Multer-a
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesFolder),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

export class AnnouncementController {
  private router: Router;

  constructor(private announcementService: IAnnouncementService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Upload slike
    this.router.post("/announcements/upload", authenticate, authorize("professor"), upload.single("image"), this.uploadImage.bind(this));

    // CRUD obaveštenja
    this.router.post(
  "/announcements",
  authenticate,
  authorize("professor"),
  upload.single("image"), // ← omogućava upload fajla
  this.createAnnouncement.bind(this)
);
    this.router.get("/announcements/:courseId", authenticate, this.getByCourse.bind(this));
    this.router.put(
  "/announcements/:id",
  authenticate,
  authorize("professor"),
  upload.single("image"), // ← podržava upload nove slike
  this.updateAnnouncement.bind(this)
);
    this.router.delete("/announcements/:id", authenticate, authorize("professor"), this.deleteAnnouncement.bind(this));
  }

  private async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Nije poslata slika" });
      }
      const relativePath = `images/announcements/${req.file.filename}`;
      res.status(200).json({ success: true, path: relativePath });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  private async createAnnouncement(req: Request, res: Response) {
  try {
    // Polja iz body-ja
    const { courseId, authorId, text } = req.body;

    if (!courseId || !authorId || !text || text.trim() === "") {
      return res.status(400).json({ success: false, message: "Polja courseId, authorId i text su obavezna." });
    }

    // Ako je fajl poslat, kreiramo imageUrl
    const imageUrl = req.file ? `images/announcements/${req.file.filename}` : null;

    const announcement = await this.announcementService.createAnnouncement(
      new Announcement(0, Number(courseId), Number(authorId), text, imageUrl!)
    );

    res.status(201).json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
}

  private async updateAnnouncement(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { courseId, authorId, text } = req.body;

    if (!courseId || !authorId || !text || text.trim() === "") {
      return res.status(400).json({ success: false, message: "Polja courseId, authorId i text su obavezna." });
    }

    // Prvo uzmi postojeću objavu
    const existing = await this.announcementService.getById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Obaveštenje nije pronađeno." });
    }

    // Ako je uploadovana nova slika, koristi nju, inače zadrži staru
    const finalImageUrl = req.file
      ? `images/announcements/${req.file.filename}`
      : existing.imageUrl;

    const announcementToUpdate = new Announcement(
      id,
      Number(courseId),
      Number(authorId),
      text,
      finalImageUrl
    );

    const updated = await this.announcementService.updateAnnouncement(announcementToUpdate);

    if (updated.id === 0) {
      res.status(400).json({ success: false, message: "Ažuriranje nije uspelo." });
    } else {
      res.status(200).json(updated);
    }
  } catch (error) {
    console.error(error);
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
