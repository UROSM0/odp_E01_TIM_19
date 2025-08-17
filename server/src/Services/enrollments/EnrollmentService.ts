import { IEnrollmentService } from "../../Domain/services/enrollments/IEnrollmentService";
import { EnrollmentRepository } from "../../Database/repositories/enrollments/EnrollmentRepository";
import { EnrollmentDto } from "../../Domain/DTOs/enrollments/EnrollmentDto";
import { Enrollment } from "../../Domain/models/Enrollment";

export class EnrollmentService implements IEnrollmentService {
  constructor(private enrollmentRepository: EnrollmentRepository) {}

  async create(userId: number, courseId: number, role: "student" | "professor"): Promise<EnrollmentDto> {
    const enrollment = await this.enrollmentRepository.create(new Enrollment(userId, courseId, role));
    return new EnrollmentDto(enrollment.userId, enrollment.courseId, enrollment.role);
  }

  async delete(userId: number, courseId: number): Promise<boolean> {
    return this.enrollmentRepository.delete(userId, courseId);
  }

  async getUserEnrollments(userId: number): Promise<any[]> {
    // vraća courseId, courseName i role
    return this.enrollmentRepository.getUserEnrollmentsWithCourses(userId);
  }
}
