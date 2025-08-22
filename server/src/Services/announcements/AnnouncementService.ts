import { IAnnouncementService } from "../../Domain/services/announcements/IAnnouncementService";
import { IAnnouncementRepository } from "../../Domain/repositories/announcements/IAnnouncementRepository";
import { Announcement } from "../../Domain/models/Announcement";

export class AnnouncementService implements IAnnouncementService {
  constructor(private announcementRepository: IAnnouncementRepository) {}

  async createAnnouncement(announcement: Announcement): Promise<Announcement> {
    return this.announcementRepository.create(announcement);
  }

  async getByCourse(courseId: number): Promise<Announcement[]> {
    return this.announcementRepository.getByCourse(courseId);
  }

  async getById(id: number): Promise<Announcement | null> {
    return this.announcementRepository.getById(id);
  }

  async updateAnnouncement(announcement: Announcement): Promise<Announcement> {
    return this.announcementRepository.update(announcement);
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    return this.announcementRepository.delete(id);
  }
}
