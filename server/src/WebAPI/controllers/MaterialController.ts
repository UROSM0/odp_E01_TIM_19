import { Router, Request, Response } from "express";
import { IMaterialService } from "../../Domain/services/materials/IMaterialService";
import { Material } from "../../Domain/models/Material";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class MaterialController {
  private router: Router;

  constructor(private materialService: IMaterialService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Kreiranje materijala - samo profesor
    this.router.post("/materials", authenticate, authorize("professor"), this.createMaterial.bind(this));

    // Dobavljanje materijala po kursu - svi upisani korisnici
    this.router.get("/materials/:courseId", authenticate, this.getByCourse.bind(this));

    // Brisanje materijala - samo profesor
    this.router.delete("/materials/:id", authenticate, authorize("professor"), this.deleteMaterial.bind(this));
  }

  private async createMaterial(req: Request, res: Response) {
    try {
      const { courseId, authorId, title, description, filePath } = req.body;

      const material = await this.materialService.createMaterial(
        new Material(0, courseId, authorId, title, description, filePath)
      );

      res.status(201).json(material);
    } catch (error) {
      res.status(500).json({ success: false, message: error });
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