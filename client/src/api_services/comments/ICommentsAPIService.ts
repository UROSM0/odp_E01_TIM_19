import type { CommentDto } from "../../models/comments/CommentsDto";


export interface ICommentsAPIService {
  getByAnnouncement(announcementId: number, token: string): Promise<CommentDto[]>;
  createComment(comment: Omit<CommentDto, "id" | "createdAt">, token: string): Promise<CommentDto | null>;
  updateComment(comment: CommentDto, token: string): Promise<CommentDto | null>;
  deleteComment(id: number, token: string): Promise<boolean>;
}
