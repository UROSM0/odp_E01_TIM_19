import { IAnnouncementService } from "../../Domain/services/announcements/IAnnouncementService";
import { AnnouncementRepository } from "../../Database/repositories/announcements/AnnouncementRepository";
import { AnnouncementDto } from "../../Domain/DTOs/announcements/AnnouncementDto";
import { Announcement } from "../../Domain/models/Announcement";

export class AnnouncementService implements IAnnouncementService {
  constructor(private announcementRepository: AnnouncementRepository) {}

  async getByCourse(courseId: number): Promise<AnnouncementDto[]> {
    const announcements = await this.announcementRepository.getByCourse(courseId);
    return announcements.map(a => new AnnouncementDto(a.id, a.courseId, a.authorId, a.text, a.imageUrl, a.createdAt));
  }

  async createAnnouncement(a: Announcement): Promise<AnnouncementDto> {
    const newA = await this.announcementRepository.create(a);
    return new AnnouncementDto(newA.id, newA.courseId, newA.authorId, newA.text, newA.imageUrl, newA.createdAt);
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    return this.announcementRepository.delete(id);
  }
}