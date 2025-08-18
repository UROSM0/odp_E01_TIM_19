import { IEnrollmentRepository } from "../../../Domain/repositories/enrollments/IEnrollmentRepository";
import { Enrollment } from "../../../Domain/models/Enrollment";
import db from "../../connection/DbConnectionPool";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class EnrollmentRepository implements IEnrollmentRepository {

  async create(enrollment: Enrollment): Promise<Enrollment> {
  console.log("📌 Trying to create enrollment:", enrollment); // dodaj ovo
  const query = `
    INSERT INTO enrollments (user_id, course_id, role)
    VALUES (?, ?, ?)
  `;
  try {
    const [result] = await db.execute<ResultSetHeader>(query, [
      enrollment.userId,
      enrollment.courseId,
      enrollment.role
    ]);

    console.log("📌 DB result:", result);

    if (result.affectedRows > 0) {
      return enrollment;
    }

    return new Enrollment();
  } catch (error) {
    console.error("❌ Error in EnrollmentRepository.create:", error);
    throw error;
  }
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

 async getUserEnrollmentsWithCourses(userId: number): Promise<any[]> {
  const query = `
    SELECT 
      e.course_id AS courseId, 
      c.name AS courseName, 
      e.role
    FROM enrollments e
    LEFT JOIN courses c ON e.course_id = c.id
    WHERE e.user_id = ?
  `;
  
  try {
    const [rows] = await db.execute<RowDataPacket[]>(query, [userId]);
    return rows.map(row => ({
      courseId: row.courseId,
      courseName: row.courseName || "Nepoznat kurs", // fallback ako kurs ne postoji
      role: row.role
    }));
  } catch (error) {
    console.error("Greška u getUserEnrollmentsWithCourses:", error);
    throw error; // propagiraj grešku ka service/controller
  }
}
}