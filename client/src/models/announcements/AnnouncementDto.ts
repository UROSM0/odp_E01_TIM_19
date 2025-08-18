export interface AnnouncementDto {
  id: number;
  courseId: number;
  authorId: number;
  text: string;
  imagePath?: string;
  createdAt: string;
  updatedAt: string;
}