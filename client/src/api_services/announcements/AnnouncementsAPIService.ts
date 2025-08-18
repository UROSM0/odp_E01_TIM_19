import axios from "axios";
import type { IAnnouncementsAPIService } from "./IAnnouncementsAPIService";
import type { AnnouncementDto } from "../../models/announcements/AnnouncementDto";

const API_URL = import.meta.env.VITE_API_URL + "announcements";

export const announcementsApi: IAnnouncementsAPIService = {
  async getAnnouncementsByCourse(courseId: number, token: string): Promise<AnnouncementDto[]> {
    try {
      const res = await axios.get<AnnouncementDto[]>(`${API_URL}/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      console.error("Greška pri učitavanju obaveštenja:", error);
      return [];
    }
  },

  async createAnnouncement(courseId: number, text: string, imageUrl: string | null, token: string): Promise<AnnouncementDto> {
    try {
      const res = await axios.post<AnnouncementDto>(
        API_URL,
        { courseId, text, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (error: any) {
      console.error("Greška pri kreiranju obaveštenja:", error.response?.data || error.message);
      throw error;
    }
  },

  async deleteAnnouncement(id: number, token: string): Promise<boolean> {
    try {
      const res = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.status === 200;
    } catch (error) {
      console.error("Greška pri brisanju obaveštenja:", error);
      return false;
    }
  },
};