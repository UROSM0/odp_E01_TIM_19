import { IAnnouncementRepository } from "../../../Domain/repositories/announcements/IAnnouncementRepository";
import { Announcement } from "../../../Domain/models/Announcement";
import db from "../../connection/DbConnectionPool";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class AnnouncementRepository implements IAnnouncementRepository {
  async create(announcement: Announcement): Promise<Announcement> {
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO announcements (course_id, author_id, text, image_url) VALUES (?, ?, ?, ?)",
      [announcement.courseId, announcement.authorId, announcement.text, announcement.imageUrl]
    );
    if (result.insertId) {
      return new Announcement(
        result.insertId,
        announcement.courseId,
        announcement.authorId,
        announcement.text,
        announcement.imageUrl
      );
    }
    return new Announcement();
  }

  async getByCourse(courseId: number): Promise<Announcement[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM announcements WHERE course_id = ? ORDER BY created_at DESC",
      [courseId]
    );
    return rows.map(
      row =>
        new Announcement(
          row.id,
          row.course_id,
          row.author_id,
          row.text,
          row.image_url,
          row.created_at,
          row.updated_at
        )
    );
  }

  async getById(id: number): Promise<Announcement | null> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM announcements WHERE id = ?",
      [id]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return new Announcement(
      row.id,
      row.course_id,
      row.author_id,
      row.text,
      row.image_url,
      row.created_at,
      row.updated_at
    );
  }

  async update(announcement: Announcement): Promise<Announcement> {
    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE announcements SET text = ?, image_url = ? WHERE id = ?",
      [announcement.text, announcement.imageUrl, announcement.id]
    );
    return result.affectedRows > 0 ? announcement : new Announcement();
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM announcements WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}
