export interface CommentDto {
  
     id: number ,
     announcementId: number ,
     authorId: number,
     text: string ,
     createdAt?: Date
}