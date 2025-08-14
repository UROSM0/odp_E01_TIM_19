import { CourseDto } from "../../DTOs/courses/CourseDto";
import { Course } from "../../models/Course";

export interface ICourseService {
  getAllCourses(): Promise<CourseDto[]>;
  getCourseById(id: number): Promise<CourseDto>;
}