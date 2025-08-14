export class AnnouncementDto {
  constructor(
    public id: number = 0,
    public courseId: number = 0,
    public authorId: number = 0,
    public text: string = "",
    public imagePath?: string,
    public createdAt?: Date
  ) {}
}