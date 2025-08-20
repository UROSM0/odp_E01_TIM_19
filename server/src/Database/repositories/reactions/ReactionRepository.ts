import { IReactionRepository } from "../../../Domain/repositories/reactions/IReactionRepository";
import { Reaction } from "../../../Domain/models/Reaction";
import db from "../../connection/DbConnectionPool";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class ReactionRepository implements IReactionRepository {

  async getByAnnouncement(announcementId: number): Promise<Reaction[]> {
    const query = `SELECT * FROM reactions WHERE announcement_id = ?`;
    const [rows] = await db.execute<RowDataPacket[]>(query, [announcementId]);
    return rows.map(r => new Reaction(r.id, r.announcement_id, r.user_id, r.lajkDislajk));
  }

  async findByUserAndAnnouncement(userId: number, announcementId: number): Promise<Reaction | null> {
    const query = `SELECT * FROM reactions WHERE user_id = ? AND announcement_id = ? LIMIT 1`;
    const [rows] = await db.execute<RowDataPacket[]>(query, [userId, announcementId]);
    if (!rows.length) return null;
    const r = rows[0];
    return new Reaction(r.id, r.announcement_id, r.user_id, r.lajkDislajk);
  }

  async create(reaction: Reaction): Promise<Reaction> {
    const query = `
      INSERT INTO reactions (announcement_id, user_id, lajkDislajk)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.execute<ResultSetHeader>(query, [
      reaction.announcementId,
      reaction.userId,
      reaction.lajkDislajk
    ]);

    if (result.insertId) {
      return new Reaction(result.insertId, reaction.announcementId, reaction.userId, reaction.lajkDislajk);
    }

    return new Reaction();
  }

  async update(reaction: Reaction): Promise<Reaction> {
    const query = `UPDATE reactions SET lajkDislajk = ? WHERE id = ?`;
    await db.execute<ResultSetHeader>(query, [reaction.lajkDislajk, reaction.id]);
    return reaction;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM reactions WHERE id = ?`;
    const [result] = await db.execute<ResultSetHeader>(query, [id]);
    return result.affectedRows > 0;
  }
}
