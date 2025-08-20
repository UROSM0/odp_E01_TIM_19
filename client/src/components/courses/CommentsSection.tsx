import { useEffect, useState } from "react";
import { commentsApi } from "../../api_services/comments/CommentsAPIService";
import type { CommentDto } from "../../models/comments/CommentsDto";
import { CommentsModal } from "../modals/CommentsModal";

interface Props {
  announcementId: number;
  user: any;
  token: string | null;
}

export function CommentsSection({ announcementId, user, token }: Props) {
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const isStudent = user?.uloga === "student";

  // ucitavanje komentara
  useEffect(() => {
    if (!token) return;
    const fetchComments = async () => {
      const data = await commentsApi.getByAnnouncement(announcementId, token);
      setComments(data);
    };
    fetchComments();
  }, [announcementId, token]);

  // dodavanje komentara
  const handleAddComment = async () => {
    if (!newComment.trim() || !token) return;
    const created = await commentsApi.createComment(
      {
        announcementId,
        authorId: user.id,
        text: newComment,
      },
      token
    );
    if (created) {
      setComments(prev => [...prev, created]);
      setNewComment("");
    }
  };

  // azuriranje komentara
  const handleUpdateComment = async (id: number) => {
    if (!editText.trim() || !token) return;
    const updated = await commentsApi.updateComment(
      {
        id,
        announcementId,
        authorId: user.id,
        text: editText,
      },
      token
    );
    if (updated) {
      setComments(prev => prev.map(c => (c.id === id ? updated : c)));
      setEditingId(null);
      setEditText("");
    }
  };

  // brisanje komentara
  const handleDeleteComment = async (id: number) => {
    if (!token || !window.confirm("Obrisati komentar?")) return;
    const success = await commentsApi.deleteComment(id, token);
    if (success) {
      setComments(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="mt-4 border-t pt-2">
      <h3 className="text-lg font-semibold mb-2">Komentari</h3>

      {/* lista komentara – prikazujemo samo 2 najnovija */}
      {comments.length === 0 ? (
        <p className="text-gray-500">Nema komentara.</p>
      ) : (
        <ul className="space-y-2">
          {comments.slice(-2).map(c => (
            <li key={c.id} className="border p-2 rounded flex flex-col">
              <div className="flex justify-between">
                {editingId === c.id ? (
                  <input
                    type="text"
                    className="border px-2 py-1 flex-1 mr-2"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                  />
                ) : (
                  <span>{c.text}</span>
                )}
                {isStudent && c.authorId === user?.id && (
                  <div className="flex gap-2 ml-2">
                    {editingId === c.id ? (
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => handleUpdateComment(c.id)}
                      >
                        Sačuvaj
                      </button>
                    ) : (
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        onClick={() => {
                          setEditingId(c.id);
                          setEditText(c.text);
                        }}
                      >
                        Izmeni
                      </button>
                    )}
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleDeleteComment(c.id)}
                    >
                      Obriši
                    </button>
                  </div>
                )}
              </div>
              <small className="text-gray-400">
                #{c.id} | Autor: {c.authorId}
              </small>
            </li>
          ))}
        </ul>
      )}

      {/* dugme za prikaz svih komentara */}
      {comments.length > 2 && (
        <button
          className="text-blue-600 underline mt-2"
          onClick={() => setModalOpen(true)}
        >
          Prikaži sve komentare
        </button>
      )}

      {/* forma za dodavanje komentara – samo studenti */}
      {isStudent && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            className="border flex-1 px-2 py-1"
            placeholder="Dodaj komentar..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={handleAddComment}
          >
            Dodaj
          </button>
        </div>
      )}

      {/* modal */}
      <CommentsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        announcementId={announcementId}
        user={user}
        token={token}
        comments={comments}
        setComments={setComments}
      />
    </div>
  );
}
