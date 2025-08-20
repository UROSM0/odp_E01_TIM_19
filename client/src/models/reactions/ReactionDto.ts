export interface ReactionDto {
     id: number,
     announcementId: number,
     userId: number,
     lajkDislajk: "lajk" | "dislajk",
     createdAt?: Date
}