import { useReactions } from "../../../hooks/reactions/useReactions";
import type { AnnouncementDto } from "../../../models/announcements/AnnouncementDto";
import { CommentsSection } from "../comments/CommentsSection";



interface Props {
  announcement: AnnouncementDto;
  user: any;
  token: string | null;
  onEdit?: (a: AnnouncementDto) => void;
  onDelete?: (id: number) => void;
}

export function AnnouncementItem({ announcement, user, token, onEdit, onDelete }: Props) {
  

  const { reactions, toggleReaction } = useReactions(announcement.id, token);

  const userReaction = reactions.find(r => r.userId === user?.id);
  const likesCount = reactions.filter(r => r.lajkDislajk === "lajk").length;
  const dislikesCount = reactions.filter(r => r.lajkDislajk === "dislajk").length;

  const isStudent = user?.uloga === "student";
  const isProfessor = user?.uloga === "professor";

  return (
    <li className="border p-4 rounded shadow-sm flex flex-col gap-2">
      {/* Tekst + slika */}
      <div className="flex items-start gap-4">
        {announcement.imageUrl && (
          <img
            src={`http://localhost:4000/${announcement.imageUrl}`}
            alt="Objava"
            className="w-24 h-24 object-cover rounded flex-shrink-0"
          />
        )}
        <div className="flex-1">{announcement.text}</div>

        {/* Dugmici za profesora */}
        {isProfessor && (
          <div className="flex flex-col gap-2 ml-4">
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded"
              onClick={() => onEdit?.(announcement)}
            >
              Izmeni
            </button>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => onDelete?.(announcement.id)}
            >
              Obriši
            </button>
          </div>
        )}
      </div>

      {/* Reakcije */}
      <div className="flex gap-2 mt-2">
        <button
          className={`px-2 py-1 rounded ${
            userReaction?.lajkDislajk === "lajk" ? "bg-green-400" : "bg-gray-200"
          } ${!isStudent ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => {
            console.log("[AnnouncementItem] Lajk clicked", { userId: user?.id, token });
            if (!isStudent || !user?.id || !token) return;
            toggleReaction(user.id, "lajk");
          }}
        >
          👍 {likesCount}
        </button>

        <button
          className={`px-2 py-1 rounded ${
            userReaction?.lajkDislajk === "dislajk" ? "bg-red-400" : "bg-gray-200"
          } ${!isStudent ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => {
            console.log("[AnnouncementItem] Dislajk clicked", { userId: user?.id, token });
            if (!isStudent || !user?.id || !token) return;
            toggleReaction(user.id, "dislajk");
          }}
        >
          👎 {dislikesCount}
        </button>
      </div>

      {/* Sekcija za komentare */}
      <CommentsSection announcementId={announcement.id} user={user} token={token} />
    </li>
  );
}
