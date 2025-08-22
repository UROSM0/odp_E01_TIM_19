import { Announcement } from "../../models/Announcement";

export interface IAnnouncementRepository {
  create(announcement: Announcement): Promise<Announcement>;
  getByCourse(courseId: number): Promise<Announcement[]>;
  getById(id: number): Promise<Announcement | null>; // 👈 dodato
  update(announcement: Announcement): Promise<Announcement>;
  delete(id: number): Promise<boolean>;
}
