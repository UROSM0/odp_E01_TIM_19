import axios from "axios";
import type { IMaterialsAPIService } from "./IMaterialsAPIService";
import type { MaterialDto } from "../../models/materials/MaterialDto";

const API_URL = import.meta.env.VITE_API_URL + "materials";

export const materialsApi: IMaterialsAPIService = {
  async getMaterialsByCourse(courseId: number, token: string): Promise<MaterialDto[]> {
    try {
      const res = await axios.get<MaterialDto[]>(`${API_URL}/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      console.error("Greška pri učitavanju materijala:", error);
      return [];
    }
  },

  async createMaterial(
    courseId: number,
    title: string,
    description: string | null,
    filePath: string,
    fileMime: string,
    token: string
  ): Promise<MaterialDto> {
    try {
      const res = await axios.post<MaterialDto>(
        API_URL,
        { courseId, title, description, filePath, fileMime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (error: any) {
      console.error("Greška pri kreiranju materijala:", error.response?.data || error.message);
      throw error;
    }
  },

  async deleteMaterial(id: number, token: string): Promise<boolean> {
    try {
      const res = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.status === 200;
    } catch (error) {
      console.error("Greška pri brisanju materijala:", error);
      return false;
    }
  },
};