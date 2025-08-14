import { IEnrollmentService } from "../../Domain/services/enrollments/IEnrollmentService";
import { EnrollmentRepository } from "../../Database/repositories/enrollments/EnrollmentRepository";
import { EnrollmentDto } from "../../Domain/DTOs/enrollments/EnrollmentDto";
import { Enrollment } from "../../Domain/models/Enrollment";

export class EnrollmentService implements IEnrollmentService {
  constructor(private enrollmentRepository: EnrollmentRepository) {}

  async create(userId: number, courseId: number, role: "student" | "professor"): Promise<EnrollmentDto> {
    const enrollment = await this.enrollmentRepository.create(new Enrollment(userId, courseId, role));
    return new EnrollmentDto(enrollment.userId,enrollment.courseId, enrollment.role);
  }

  async getUserEnrollments(userId: number): Promise<EnrollmentDto[]> {
    const enrollments = await this.enrollmentRepository.getByUserId(userId);
    return enrollments.map(e => new EnrollmentDto(e.userId,e.courseId, e.role));
  }

  async delete(userId: number, courseId: number): Promise<boolean> {
    return this.enrollmentRepository.delete(userId, courseId);
  }
}