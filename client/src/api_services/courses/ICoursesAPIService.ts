import type { CourseDto } from "../../models/courses/CourseDto";

export interface ICoursesAPIService {
  getAllCourses(): Promise<CourseDto[]>;
  enrollUser(courseId: number, userId: number, role: string, token: string): Promise<void>;
}