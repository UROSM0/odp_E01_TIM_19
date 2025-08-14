export class ReactionDto {
  constructor(
    public id: number = 0,
    public announcementId: number = 0,
    public userId: number = 0,
    public lajkDislajk: "lajk" | "dislajk" = "lajk",
    public createdAt?: Date
  ) {}
}