import { ICourseRepository } from "../../../Domain/repositories/courses/ICourseRepository";
import { Course } from "../../../Domain/models/Course";
import db from "../../connection/DbConnectionPool";
import { RowDataPacket } from "mysql2";

export class CourseRepository implements ICourseRepository {
  async getAll(): Promise<Course[]> {
    const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM courses ORDER BY name ASC");
    return rows.map(row => new Course(row.id, row.code, row.name));
  }

  async getById(id: number): Promise<Course | null> {
    const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM courses WHERE id = ?", [id]);
    if (rows.length > 0) {
      const row = rows[0];
      return new Course(row.id, row.code, row.name);
    }
    return null;
  }
}