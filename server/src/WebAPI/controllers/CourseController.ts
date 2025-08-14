import { Router, Request, Response } from "express";
import { ICourseService } from "../../Domain/services/courses/ICourseService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class CourseController {
  private router: Router;
  constructor(private courseService: ICourseService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/courses", authenticate, this.getAllCourses.bind(this));
    this.router.get("/courses/:id", authenticate, this.getCourseById.bind(this));
  }

  private async getAllCourses(req: Request, res: Response) {
    try {
      const courses = await this.courseService.getAllCourses();
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  private async getCourseById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const course = await this.courseService.getCourseById(id);
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  public getRouter() {
    return this.router;
  }
}