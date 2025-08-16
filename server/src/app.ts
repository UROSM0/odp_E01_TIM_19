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

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Repositories
const userRepository: IUserRepository = new UserRepository();
const courseRepository = new CourseRepository();
const enrollmentRepository = new EnrollmentRepository();

// Services
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);
const courseService: ICourseService = new CourseService(courseRepository);
const enrollmentService = new EnrollmentService(enrollmentRepository);

// WebAPI routes
const authController = new AuthController(authService);
const userController = new UserController(userService);
const courseController = new CourseController(courseService);
const enrollmentController = new EnrollmentController(enrollmentService);

// Registering routes
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', courseController.getRouter());
app.use('/api/v1', enrollmentController.getRouter());

export default app;