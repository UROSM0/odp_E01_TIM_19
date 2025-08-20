import type { AnnouncementDto } from "../../models/announcements/AnnouncementDto";
import { AnnouncementModal } from "../modals/AnnouncementModal";
import { AnnouncementItem } from "./AnnouncementItem";

interface Props {
  announcements: AnnouncementDto[];
  user: any;
  token: string | null;
  courseId: number;
  onSave: (a: AnnouncementDto) => void;
  onDelete: (id: number) => void;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  editingAnnouncement: AnnouncementDto | null;
  setEditingAnnouncement: (a: AnnouncementDto | null) => void;
}

export function AnnouncementsSection({
  announcements,
  user,
  token,
  courseId,
  onSave,
  onDelete,
  modalOpen,
  setModalOpen,
  editingAnnouncement,
  setEditingAnnouncement
}: Props) {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Objave</h2>
        {user?.uloga === "professor" && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => { setEditingAnnouncement(null); setModalOpen(true); }}
          >
            + Dodaj objavu
          </button>
        )}
      </div>

      {announcements.length === 0 ? (
        <p>Nema objava za ovaj kurs.</p>
      ) : (
        <ul className="space-y-4">
          {announcements.map(a => (
            <AnnouncementItem
              key={a.id}
              announcement={a}
              user={user}
              token={token}
              onEdit={(a) => { setEditingAnnouncement(a); setModalOpen(true); }}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}

      <AnnouncementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={onSave}
        initialData={editingAnnouncement || undefined}
        courseId={courseId}
      />
    </section>
  );
}
