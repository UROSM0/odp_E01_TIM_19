import express from 'express';
import cors from 'cors';
import { IAuthService } from './Domain/services/auth/IAuthService';
import { AuthService } from './Services/auth/AuthService';
import { IUserRepository } from './Domain/repositories/users/IUserRepository';
import { UserRepository } from './Database/repositories/users/UserRepository';
import { AuthController } from './WebAPI/controllers/AuthController';
import { IUserService } from './Domain/services/users/IUserService';
import { UserService } from './Services/users/UserService';
import { UserController } from './WebAPI/controllers/UserController';
import { ICourseService } from './Domain/services/courses/ICourseService';
import { CourseService } from './Services/courses/CourseService';
import { CourseRepository } from './Database/repositories/courses/CourseRepository';
import { CourseController } from './WebAPI/controllers/CourseController';
import { EnrollmentRepository } from './Database/repositories/enrollments/EnrollmentRepository';
import { EnrollmentService } from './Services/enrollments/EnrollmentService';
import { EnrollmentController } from './WebAPI/controllers/EnrollmentController';
import { IEnrollmentService } from './Domain/services/enrollments/IEnrollmentService';
import { AnnouncementRepository } from './Database/repositories/announcements/AnnouncementRepository';
import { IAnnouncementService } from './Domain/services/announcements/IAnnouncementService';
import { AnnouncementService } from './Services/announcements/AnnouncementService';
import { AnnouncementController } from './WebAPI/controllers/AnnouncementController';
import { MaterialRepository } from './Database/repositories/materials/MaterialRepository';
import { IMaterialService } from './Domain/services/materials/IMaterialService';
import { MaterialService } from './Services/materials/MaterialService';
import { MaterialController } from './WebAPI/controllers/MaterialController';


require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Repositories
const userRepository: IUserRepository = new UserRepository();
const courseRepository = new CourseRepository();
const enrollmentRepository = new EnrollmentRepository();
const announcementRepository=new AnnouncementRepository();
const materialRepository=new MaterialRepository();

// Services
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);
const courseService: ICourseService = new CourseService(courseRepository);
const enrollmentService:IEnrollmentService = new EnrollmentService(enrollmentRepository);
const announcementService:IAnnouncementService=new AnnouncementService(announcementRepository);
const materialService:IMaterialService=new MaterialService(materialRepository);

// WebAPI routes
const authController = new AuthController(authService);
const userController = new UserController(userService);
const courseController = new CourseController(courseService);
const enrollmentController = new EnrollmentController(enrollmentService);
const announcementController=new AnnouncementController(announcementService);
const materialController=new MaterialController(materialService);

// Registering routes
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', courseController.getRouter());
app.use('/api/v1', enrollmentController.getRouter());
app.use('/api/v1', announcementController.getRouter());
app.use('/api/v1', materialController.getRouter());

export default app;