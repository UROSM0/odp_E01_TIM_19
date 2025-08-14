import { Reaction } from "../../models/Reaction";

export interface IReactionRepository {
  addOrUpdate(reaction: Reaction): Promise<Reaction>;
  getByAnnouncement(announcementId: number): Promise<Reaction[]>;
}