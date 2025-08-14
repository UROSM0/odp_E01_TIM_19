import { IReactionService } from "../../Domain/services/reactions/IReactionService";
import { ReactionRepository } from "../../Database/repositories/reactions/ReactionRepository";
import { ReactionDto } from "../../Domain/DTOs/reactions/ReactionDto";
import { Reaction } from "../../Domain/models/Reaction";

export class ReactionService implements IReactionService {
  constructor(private reactionRepository: ReactionRepository) {}

  async getByAnnouncement(announcementId: number): Promise<ReactionDto[]> {
    const reactions = await this.reactionRepository.getByAnnouncement(announcementId);
    return reactions.map(r => new ReactionDto(r.id, r.announcementId, r.userId, r.lajkDislajk));
  }

  async createReaction(r: Reaction): Promise<ReactionDto> {
    const newR = await this.reactionRepository.create(r);
    return new ReactionDto(newR.id, newR.announcementId, newR.userId, newR.lajkDislajk);
  }

  async deleteReaction(id: number): Promise<boolean> {
    return this.reactionRepository.delete(id);
  }
}