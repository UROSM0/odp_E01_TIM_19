import { Router, Request, Response } from "express";
import { IMaterialService } from "../../Domain/services/materials/IMaterialService";
import { Material } from "../../Domain/models/Material";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import multer from "multer";
import path from "path";
import fs from "fs";

// Folder za fajlove
const materialsFolder = path.join(__dirname, "../../public/uploads/materials");
if (!fs.existsSync(materialsFolder)) fs.mkdirSync(materialsFolder, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, materialsFolder),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

export class MaterialController {
  private router: Router;

  constructor(private materialService: IMaterialService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/materials/upload",
      authenticate,
      authorize("professor"),
      upload.single("file"),
      this.uploadMaterialFile.bind(this)
    );

    this.router.post(
      "/materials",
      authenticate,
      authorize("professor"),
      this.createMaterial.bind(this)
    );

    this.router.get("/materials/:courseId", authenticate, this.getByCourse.bind(this));

    this.router.delete(
      "/materials/:id",
      authenticate,
      authorize("professor"),
      this.deleteMaterial.bind(this)
    );
  }

  private async uploadMaterialFile(req: Request, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: "Nije poslat fajl" });
      const relativePath = `uploads/materials/${req.file.filename}`;
      res.status(200).json({ success: true, path: relativePath, mimeType: req.file.mimetype });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  private async createMaterial(req: Request, res: Response) {
  try {
    const { courseId, authorId, title, description, filePath, fileMime } = req.body;
    console.log("CREATE MATERIAL PAYLOAD:", req.body);

    if (!courseId || !authorId || !title || !filePath) {
      return res.status(400).json({ success: false, message: "Polja courseId, authorId, title i filePath su obavezna." });
    }

    const material = new Material(0, courseId, authorId, title, description || "", filePath, fileMime || "");
    console.log("NAPRAVLJEN MATERIAL:", material);

    const savedMaterial = await this.materialService.createMaterial(material);
    res.status(201).json(savedMaterial);
  } catch (error) {
    console.error("GREŠKA U CREATE MATERIAL:", error);
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
  }
}


  private async getByCourse(req: Request, res: Response) {
    try {
      const courseId = Number(req.params.courseId);
      const materials = await this.materialService.getByCourse(courseId);
      res.status(200).json(materials);
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  private async deleteMaterial(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const success = await this.materialService.deleteMaterial(id);
      res.status(success ? 200 : 400).json({ success });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
