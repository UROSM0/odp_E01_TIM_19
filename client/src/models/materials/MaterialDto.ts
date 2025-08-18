export interface MaterialDto {
  id: number;
  courseId: number;
  authorId: number;
  title: string;
  description?: string;
  filePath: string;
  fileMime: string;
  createdAt: string;
}