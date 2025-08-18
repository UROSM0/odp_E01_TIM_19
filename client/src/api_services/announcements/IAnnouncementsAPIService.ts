import type { AnnouncementDto } from "../../models/announcements/AnnouncementDto";

export interface IAnnouncementsAPIService {
  getAnnouncementsByCourse(courseId: number, token: string): Promise<AnnouncementDto[]>;
  
  createAnnouncement(courseId: number, text: string, imageUrl: string | null, token: string): Promise<AnnouncementDto>;
  
  deleteAnnouncement(id: number, token: string): Promise<boolean>;
}