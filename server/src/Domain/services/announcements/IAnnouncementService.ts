import { AnnouncementDto } from "../../DTOs/announcements/AnnouncementDto";
import { Announcement } from "../../models/Announcement";

export interface IAnnouncementService {
  getByCourse(courseId: number): Promise<AnnouncementDto[]>;
  createAnnouncement(a: Announcement): Promise<AnnouncementDto>;
  deleteAnnouncement(id: number): Promise<boolean>;
}