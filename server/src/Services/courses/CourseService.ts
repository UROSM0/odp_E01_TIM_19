import { ICourseService } from "../../Domain/services/courses/ICourseService";
import { CourseRepository } from "../../Database/repositories/courses/CourseRepository";
import { CourseDto } from "../../Domain/DTOs/courses/CourseDto";
import { Course } from "../../Domain/models/Course";

export class CourseService implements ICourseService {
  constructor(private courseRepository: CourseRepository) {}

  async getAllCourses(): Promise<CourseDto[]> {
    const courses: Course[] = await this.courseRepository.getAll();
    return courses.map(c => new CourseDto(c.id, c.name));
  }

  async getCourseById(id: number): Promise<CourseDto> {
    const c = await this.courseRepository.getById(id);
    return new CourseDto(c?.id ?? 0, c?.name?? "");
  }
}