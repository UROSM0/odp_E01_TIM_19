import axios from "axios";
import type { IReactionsAPIService } from "./IReactionsAPIService";
import type { ReactionDto } from "../../models/reactions/ReactionDto";

const API_URL = import.meta.env.VITE_API_URL + "reactions";

export const reactionsApi: IReactionsAPIService = {
  async getByAnnouncement(announcementId: number, token: string): Promise<ReactionDto[]> {
    try {
      const res = await axios.get<ReactionDto[]>(`${API_URL}/${announcementId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error: any) {
      console.error("Greška pri učitavanju reakcija:", error.response?.data || error.message);
      return [];
    }
  },

  async toggleReaction(
    announcementId: number,
    userId: number,
    lajkDislajk: "lajk" | "dislajk",
    token: string
  ): Promise<{ success: boolean; action: string; reaction?: ReactionDto }> {
    try {
      const res = await axios.post(
        API_URL,
        { announcementId, userId, lajkDislajk },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (error: any) {
      console.error("Greška pri toggle reakciji:", error.response?.data || error.message);
      throw error;
    }
  },

  async deleteReaction(id: number, token: string): Promise<boolean> {
    try {
      const res = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.status === 200;
    } catch (error: any) {
      console.error("Greška pri brisanju reakcije:", error.response?.data || error.message);
      return false;
    }
  },
};
