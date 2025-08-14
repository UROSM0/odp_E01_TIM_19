import { Enrollment } from "../../models/Enrollment";

export interface IEnrollmentRepository {
  enroll(userId: number, courseId: number, role: 'student' | 'professor'): Promise<boolean>;
  getUserEnrollments(userId: number): Promise<Enrollment[]>;
  countUserEnrollments(userId: number): Promise<number>;
}