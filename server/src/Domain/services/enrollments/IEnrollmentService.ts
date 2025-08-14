import { EnrollmentDto } from "../../DTOs/enrollments/EnrollmentDto";
import { Enrollment } from "../../models/Enrollment";

export interface IEnrollmentService {
  create(userId: number, courseId: number, role: "student" | "professor"): Promise<EnrollmentDto>;
  getUserEnrollments(userId: number): Promise<EnrollmentDto[]>;
  delete(userId: number, courseId: number): Promise<boolean>;
}