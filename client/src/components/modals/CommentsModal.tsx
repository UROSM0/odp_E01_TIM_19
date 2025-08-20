import { useState } from "react";
import { commentsApi } from "../../api_services/comments/CommentsAPIService";
import { CommentItem } from "../courses/CommentItem";
import type { CommentDto } from "../../models/comments/CommentsDto";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  announcementId: number;
  user: any;
  token: string | null;
  comments: CommentDto[];
  setComments: React.Dispatch<React.SetStateAction<CommentDto[]>>;
}

export function CommentsModal({ isOpen, onClose, announcementId, user, token, comments, setComments }: Props) {
  const [newComment, setNewComment] = useState("");

  if (!isOpen) return null;

  const handleAddComment = async () => {
    if (!newComment.trim() || !token) return;
    const comment = await commentsApi.createComment(
      { announcementId, authorId: user.id, text: newComment },
      token
    );
    if (comment) setComments(prev => [...prev, comment]);
    setNewComment("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Svi komentari</h3>

        <ul className="space-y-2 mb-4">
          {comments.map(c => (
            <CommentItem key={c.id} comment={c} user={user} token={token} setComments={setComments} />
          ))}
        </ul>

        {user?.uloga === "student" && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border px-2 py-1 rounded"
              placeholder="Dodaj komentar..."
            />
            <button onClick={handleAddComment} className="bg-blue-600 text-white px-3 py-1 rounded">
              Dodaj
            </button>
          </div>
        )}

        <button onClick={onClose} className="mt-4 bg-gray-500 text-white px-3 py-1 rounded">
          Zatvori
        </button>
      </div>
    </div>
  );
}
