import { Router, Request, Response } from "express";
import { IEnrollmentService } from "../../Domain/services/enrollments/IEnrollmentService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class EnrollmentController {
  private router: Router;
  constructor(private enrollmentService: IEnrollmentService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/enrollments",authenticate,this.create.bind(this)); //vratiti authenticate
    this.router.get("/enrollments/:userId", authenticate, this.getUserEnrollments.bind(this));
    this.router.delete("/enrollments", authenticate, this.delete.bind(this));
  }

  private async create(req: Request, res: Response) {
    try {
      const { userId, courseId, role } = req.body;
      const enrollment = await this.enrollmentService.create(userId, courseId, role);
      res.status(201).json(enrollment);
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  private async getUserEnrollments(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const enrollments = await this.enrollmentService.getUserEnrollments(userId);
      res.status(200).json(enrollments);
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  private async delete(req: Request, res: Response) {
    try {
      const { userId, courseId } = req.body;
      const success = await this.enrollmentService.delete(userId, courseId);
      res.status(success ? 200 : 400).json({ success });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  public getRouter() {
    return this.router;
  }
}