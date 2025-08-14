import { Enrollment } from "../../models/Enrollment";

export interface IEnrollmentRepository {
  create(enrollment: Enrollment): Promise<Enrollment>;
  getByUserId(userId: number): Promise<Enrollment[]>;
  delete(userId: number, courseId: number): Promise<boolean>;
}