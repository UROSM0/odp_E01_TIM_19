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

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Repositories
const userRepository: IUserRepository = new UserRepository();
const courseRepository = new CourseRepository();

// Services
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);
const courseService: ICourseService = new CourseService(courseRepository);

// WebAPI routes
const authController = new AuthController(authService);
const userController = new UserController(userService);
const courseController = new CourseController(courseService);

// Registering routes
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', courseController.getRouter());

export default app;