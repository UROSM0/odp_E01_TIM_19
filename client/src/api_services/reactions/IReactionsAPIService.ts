import type { ReactionDto } from "../../models/reactions/ReactionDto";

export interface IReactionsAPIService {

  getByAnnouncement(announcementId: number, token: string): Promise<ReactionDto[]>;

  toggleReaction(
    announcementId: number,
    userId: number,
    lajkDislajk: "lajk" | "dislajk",
    token: string
  ): Promise<{ success: boolean; action: string; reaction?: ReactionDto }>;

  deleteReaction(id: number, token: string): Promise<boolean>;
}
