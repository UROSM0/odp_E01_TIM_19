import { ReactionDto } from "../../DTOs/reactions/ReactionDto";
import { Reaction } from "../../models/Reaction";

export interface IReactionService {
  getByAnnouncement(announcementId: number): Promise<ReactionDto[]>;
  createReaction(r: Reaction): Promise<ReactionDto>;
  deleteReaction(id: number): Promise<boolean>;
}