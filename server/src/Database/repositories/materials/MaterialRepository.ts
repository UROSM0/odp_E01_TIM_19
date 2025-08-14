import { IMaterialRepository } from "../../../Domain/repositories/materials/IMaterialRepository";
import { Material } from "../../../Domain/models/Material";
import db from "../../connection/DbConnectionPool";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class MaterialRepository implements IMaterialRepository {
  async create(material: Material): Promise<Material> {
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO materials (course_id, author_id, title, description, file_url, file_mime) VALUES (?, ?, ?, ?, ?, ?)",
      [material.courseId, material.authorId, material.title, material.description, material.filePath, material.fileMime]
    );
    if (result.insertId) {
      return new Material(result.insertId, material.courseId, material.authorId, material.title, material.description, material.filePath, material.fileMime);
    }
    return new Material();
  }

  async getByCourse(courseId: number): Promise<Material[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM materials WHERE course_id = ? ORDER BY created_at DESC",
      [courseId]
    );
    return rows.map(row => new Material(row.id, row.course_id, row.author_id, row.title, row.description, row.file_url, row.file_mime, row.created_at));
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM materials WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}