import { Reaction } from "../../models/Reaction";

export interface IReactionRepository {
  create(reaction: Reaction): Promise<Reaction>;
  update(reaction: Reaction): Promise<Reaction>;
  delete(id: number): Promise<boolean>;
  getByAnnouncement(announcementId: number): Promise<Reaction[]>;
  findByUserAndAnnouncement(userId: number, announcementId: number): Promise<Reaction | null>;
}
