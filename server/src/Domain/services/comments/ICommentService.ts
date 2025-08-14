import { CommentDto } from "../../DTOs/comments/CommentDto";
import { Comment } from "../../models/Comment";

export interface ICommentService {
  getByAnnouncement(announcementId: number): Promise<CommentDto[]>;
  createComment(c: Comment): Promise<CommentDto>;
  updateComment(c: Comment): Promise<CommentDto>;
  deleteComment(id: number): Promise<boolean>;
}