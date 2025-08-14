import { Reaction } from "../../models/Reaction";

export interface IReactionRepository {
  getByAnnouncement(announcementId: number): Promise<Reaction[]>;
  create(reaction: Reaction): Promise<Reaction>;
  delete(id: number): Promise<boolean>;
}