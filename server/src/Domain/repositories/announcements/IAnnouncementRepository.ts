import { Announcement } from "../../models/Announcement";

export interface IAnnouncementRepository {
  create(announcement: Announcement): Promise<Announcement>;
  getByCourse(courseId: number): Promise<Announcement[]>;
  update(announcement: Announcement): Promise<Announcement>;
  delete(id: number): Promise<boolean>;
}