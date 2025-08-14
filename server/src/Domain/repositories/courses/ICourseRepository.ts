import { Course } from "../../models/Course";

export interface ICourseRepository {
  getAll(): Promise<Course[]>;
  getById(id: number): Promise<Course | null>;
}