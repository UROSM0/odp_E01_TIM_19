export class Announcement {
  constructor(
    public id: number = 0,
    public courseId: number = 0,
    public authorId: number = 0,
    public text: string = '',
    public imageUrl: string ="",
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}