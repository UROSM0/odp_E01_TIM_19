import { Announcement } from "../../models/Announcement";

export interface IAnnouncementService {
  createAnnouncement(announcement: Announcement): Promise<Announcement>;
  getByCourse(courseId: number): Promise<Announcement[]>;
  getById(id: number): Promise<Announcement | null>; // 👈 dodato
  updateAnnouncement(announcement: Announcement): Promise<Announcement>;
  deleteAnnouncement(id: number): Promise<boolean>;
}
