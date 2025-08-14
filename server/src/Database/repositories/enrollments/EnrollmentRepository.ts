import { IEnrollmentRepository } from "../../../Domain/repositories/enrollments/IEnrollmentRepository";
import { Enrollment } from "../../../Domain/models/Enrollment";
import db from "../../connection/DbConnectionPool";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class EnrollmentRepository implements IEnrollmentRepository {

  async create(enrollment: Enrollment): Promise<Enrollment> {
    const query = `
      INSERT INTO enrollments (user_id, course_id, role)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.execute<ResultSetHeader>(query, [
      enrollment.userId,
      enrollment.courseId,
      enrollment.role
    ]);

    if (result.insertId) {
      return new Enrollment(enrollment.userId, enrollment.courseId, enrollment.role);
    }

    return new Enrollment();
  }

  async getByUserId(userId: number): Promise<Enrollment[]> {
    const query = `SELECT * FROM enrollments WHERE user_id = ?`;
    const [rows] = await db.execute<RowDataPacket[]>(query, [userId]);

    return rows.map(row => new Enrollment(row.user_id, row.course_id, row.role));
  }

  async delete(userId: number, courseId: number): Promise<boolean> {
    const query = `DELETE FROM enrollments WHERE user_id = ? AND course_id = ?`;
    const [result] = await db.execute<ResultSetHeader>(query, [userId, courseId]);

    return result.affectedRows > 0;
  }
}