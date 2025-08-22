import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-hidden">
      <div className="bg-white/90 backdrop-blur-lg p-6 rounded-3xl w-full max-w-md shadow-2xl relative max-h-[80vh] flex flex-col">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Svi komentari</h2>

        {/* Scrollable comments */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {comments.map(c => (
            <CommentItem key={c.id} comment={c} user={user} token={token} setComments={setComments} />
          ))}
        </div>

        {/* Add new comment (if student) */}
        {user?.uloga === "student" && (
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border px-2 py-1 rounded focus:ring-2 focus:ring-yellow-300"
              placeholder="Dodaj komentar..."
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              Dodaj
            </button>
          </div>
        )}

        {/* Close button at bottom */}
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded self-end hover:bg-gray-400 transition"
        >
          Zatvori
        </button>
      </div>
    </div>
  );
}
