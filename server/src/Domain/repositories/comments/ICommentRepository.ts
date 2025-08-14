import { Comment } from "../../models/Comment";

export interface ICommentRepository {
  create(comment: Comment): Promise<Comment>;
  update(comment: Comment): Promise<Comment>;
  delete(id: number): Promise<boolean>;
  getByAnnouncement(announcementId: number): Promise<Comment[]>;
}