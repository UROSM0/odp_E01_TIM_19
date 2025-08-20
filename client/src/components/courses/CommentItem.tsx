import { useState } from "react";
import { commentsApi } from "../../api_services/comments/CommentsAPIService";
import type { CommentDto } from "../../models/comments/CommentsDto";

interface Props {
  comment: CommentDto;
  user: any;
  token: string | null;
  setComments: React.Dispatch<React.SetStateAction<CommentDto[]>>;
}

export function CommentItem({ comment, user, token, setComments }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.text);

  const canModify = user?.uloga === "student" && user?.id === comment.authorId;

  const handleDelete = async () => {
    if (!token) return;
    const success = await commentsApi.deleteComment(comment.id, token);
    if (success) setComments(prev => prev.filter(c => c.id !== comment.id));
  };

  const handleUpdate = async () => {
    if (!token) return;
    const updated = await commentsApi.updateComment({ ...comment, text }, token);
    if (updated) {
      setComments(prev => prev.map(c => (c.id === comment.id ? updated : c)));
      setIsEditing(false);
    }
  };

  return (
    <li className="border p-2 rounded">
      <div className="flex justify-between items-center">
        <span className="font-medium">#{comment.authorId}:</span>
        {canModify && (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(!isEditing)} className="text-yellow-600">✏️</button>
            <button onClick={handleDelete} className="text-red-600">🗑️</button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border rounded px-2 py-1"
          />
          <button onClick={handleUpdate} className="bg-green-600 text-white px-2 rounded">Sačuvaj</button>
        </div>
      ) : (
        <p>{comment.text}</p>
      )}
    </li>
  );
}
