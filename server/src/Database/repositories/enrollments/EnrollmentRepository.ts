import { IEnrollmentRepository } from "../../../Domain/repositories/enrollments/IEnrollmentRepository";
import { Enrollment } from "../../../Domain/models/Enrollment";
import db from "../../connection/DbConnectionPool";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class EnrollmentRepository implements IEnrollmentRepository {
  async enroll(userId: number, courseId: number, role: 'student' | 'professor'): Promise<boolean> {
    try {
      const query = `
        INSERT INTO enrollments (user_id, course_id, role)
        VALUES (?, ?, ?)
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [userId, courseId, role]);
      return result.affectedRows > 0;
    } catch {
      return false;
    }
  }

  async getUserEnrollments(userId: number): Promise<Enrollment[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM enrollments WHERE user_id = ?",
      [userId]
    );
    return rows.map(row => new Enrollment(row.user_id, row.course_id, row.role));
  }

  async countUserEnrollments(userId: number): Promise<number> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM enrollments WHERE user_id = ?",
      [userId]
    );
    return rows[0]?.count || 0;
  }
}