export class Comment {
  constructor(
    public id: number = 0,
    public announcementId: number = 0,
    public authorId: number = 0,
    public text: string = '',
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}