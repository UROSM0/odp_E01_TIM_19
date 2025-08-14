import { ICommentRepository } from "../../../Domain/repositories/comments/ICommentRepository";
import { Comment } from "../../../Domain/models/Comment";
import db from "../../connection/DbConnectionPool";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class CommentRepository implements ICommentRepository {
  async create(comment: Comment): Promise<Comment> {
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO comments (announcement_id, author_id, text) VALUES (?, ?, ?)",
      [comment.announcementId, comment.authorId, comment.text]
    );
    if (result.insertId) {
      return new Comment(result.insertId, comment.announcementId, comment.authorId, comment.text);
    }
    return new Comment();
  }

  async update(comment: Comment): Promise<Comment> {
    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE comments SET text = ? WHERE id = ?",
      [comment.text, comment.id]
    );
    return result.affectedRows > 0 ? comment : new Comment();
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM comments WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  async getByAnnouncement(announcementId: number): Promise<Comment[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM comments WHERE announcement_id = ? ORDER BY created_at ASC",
      [announcementId]
    );
    return rows.map(row => new Comment(row.id, row.announcement_id, row.author_id, row.text, row.created_at, row.updated_at));
  }
}