import { ReactionDto } from "../../DTOs/reactions/ReactionDto";
import { Reaction } from "../../models/Reaction";

export interface IReactionService {
  createReaction(reaction: Reaction): Promise<ReactionDto>;
  getByAnnouncement(announcementId: number): Promise<ReactionDto[]>;
  deleteReaction(id: number): Promise<boolean>;
}
