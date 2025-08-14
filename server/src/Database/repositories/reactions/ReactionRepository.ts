import { IReactionRepository } from "../../../Domain/repositories/reactions/IReactionRepository";
import { Reaction, ReactionValue } from "../../../Domain/models/Reaction";
import db from "../../connection/DbConnectionPool";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class ReactionRepository implements IReactionRepository {
  async addOrUpdate(reaction: Reaction): Promise<Reaction> {
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO reactions (announcement_id, user_id, lajkDislajk) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE lajkDislajk = VALUES(lajkDislajk)`,
      [reaction.announcementId, reaction.userId, reaction.lajkDislajk]
    );
    return new Reaction(result.insertId || reaction.id, reaction.announcementId, reaction.userId, reaction.lajkDislajk, reaction.createdAt);
  }

  async getByAnnouncement(announcementId: number): Promise<Reaction[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM reactions WHERE announcement_id = ?",
      [announcementId]
    );
    return rows.map(row => new Reaction(row.id, row.announcement_id, row.user_id, row.lajkDislajk, row.created_at));
  }
}