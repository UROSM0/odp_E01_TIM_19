import axios from "axios";
import type { CommentDto } from "../../models/comments/CommentsDto";

const API_BASE = import.meta.env.VITE_API_URL + "comments";

export const commentsApi = {
  
  async getByAnnouncement(announcementId: number, token: string): Promise<CommentDto[]> {
    try {
      const res = await axios.get<CommentDto[]>(`${API_BASE}/${announcementId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error("[commentsApi.getByAnnouncement]", err);
      return [];
    }
  },

  
  async createComment(comment: Omit<CommentDto, "id">, token: string): Promise<CommentDto | null> {
    try {
      const res = await axios.post<CommentDto>(API_BASE, comment, {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
      });
      return res.data;
    } catch (err) {
      console.error("[commentsApi.createComment]", err);
      return null;
    }
  },

  
  async updateComment(comment: CommentDto, token: string): Promise<CommentDto | null> {
    try {
      const res = await axios.put<CommentDto>(`${API_BASE}/${comment.id}`, comment, {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
      });
      return res.data;
    } catch (err) {
      console.error("[commentsApi.updateComment]", err);
      return null;
    }
  },

  
  async deleteComment(id: number, token: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch (err) {
      console.error("[commentsApi.deleteComment]", err);
      return false;
    }
  },
};
