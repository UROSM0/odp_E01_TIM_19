import { ICommentService } from "../../Domain/services/comments/ICommentService";
import { CommentRepository } from "../../Database/repositories/comments/CommentRepository";
import { CommentDto } from "../../Domain/DTOs/comments/CommentDto";
import { Comment } from "../../Domain/models/Comment";

export class CommentService implements ICommentService {
  constructor(private commentRepository: CommentRepository) {}

  async getByAnnouncement(announcementId: number): Promise<CommentDto[]> {
    const comments = await this.commentRepository.getByAnnouncement(announcementId);
    return comments.map(c => new CommentDto(c.id, c.announcementId, c.authorId, c.text, c.createdAt));
  }

  async createComment(c: Comment): Promise<CommentDto> {
    const newC = await this.commentRepository.create(c);
    return new CommentDto(newC.id, newC.announcementId, newC.authorId, newC.text, newC.createdAt);
  }

  async updateComment(c: Comment): Promise<CommentDto> {
    const updatedC = await this.commentRepository.update(c);
    return new CommentDto(updatedC.id, updatedC.announcementId, updatedC.authorId, updatedC.text, updatedC.createdAt);
  }

  async deleteComment(id: number): Promise<boolean> {
    return this.commentRepository.delete(id);
  }
}