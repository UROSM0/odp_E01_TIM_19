export type ReactionValue = 'lajk' | 'dislajk';

export class Reaction {
  constructor(
    public id: number = 0,
    public announcementId: number = 0,
    public userId: number = 0,
    public lajkDislajk: ReactionValue = 'lajk',
    public createdAt: Date = new Date()
  ) {}
}