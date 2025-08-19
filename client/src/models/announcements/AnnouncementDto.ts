export interface AnnouncementDto {
  id: number;
  courseId: number;
  authorId: number;
  text: string;
  imageUrl?: string;
  createdAt: string;
}