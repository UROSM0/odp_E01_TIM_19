import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { coursesApi } from "../../api_services/courses/CoursesAPIService";
import { announcementsApi } from "../../api_services/announcements/AnnouncementsAPIService";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { AnnouncementDto } from "../../models/announcements/AnnouncementDto";
import { AnnouncementModal } from "../modals/AnnouncementModal";

export function CourseForma() {
  const { id } = useParams<{ id: string }>();
  const courseId = Number(id);
  const { token, user } = useAuth();

  const [courseName, setCourseName] = useState<string>("");
  const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementDto | null>(null);

  useEffect(() => {
    if (!courseId || !token) return;

    const fetchData = async () => {
      try {
        const course = await coursesApi.getCourseById(courseId);
        setCourseName(course?.name || "Nepoznat kurs");

        const fetchedAnnouncements = await announcementsApi.getAnnouncementsByCourse(courseId, token);
        setAnnouncements(fetchedAnnouncements);
      } catch (error) {
        console.error("Greška pri učitavanju kursa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, token]);

  if (loading) return <div>Učitavanje kursa...</div>;

  const handleSaveAnnouncement = (a: AnnouncementDto) => {
    setAnnouncements(prev => {
      const exists = prev.find(x => x.id === a.id);
      if (exists) return prev.map(x => x.id === a.id ? a : x);
      return [a, ...prev];
    });
    setEditingAnnouncement(null);
    setAnnouncementModalOpen(false);
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!token) return alert("Nema tokena");
    if (!window.confirm("Da li si siguran da želiš da obrišeš ovu objavu?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/v1/announcements/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Greška:", errText);
        return alert("Brisanje nije uspelo");
      }

      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error("Greška:", err);
      alert("Greška pri komunikaciji sa serverom");
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{courseName}</h1>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Objave</h2>
          {user?.uloga === "professor" && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => { setEditingAnnouncement(null); setAnnouncementModalOpen(true); }}
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
              <li
                key={a.id}
                className="border p-4 rounded shadow-sm flex items-start gap-4"
              >
                {/* Thumbnail slike */}
                {a.imageUrl && (
                  <img
                    src={`http://localhost:4000/${a.imageUrl}`}
                    alt="Objava"
                    className="w-24 h-24 object-cover rounded flex-shrink-0"
                  />
                )}

                {/* Tekst obaveštenja */}
                <div className="flex-1">
                  <p>{a.text}</p>
                </div>

                {/* Dugmad za edit i delete (ako je profesor) */}
                {user?.uloga === "professor" && (
                  <div className="flex flex-col gap-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => { setEditingAnnouncement(a); setAnnouncementModalOpen(true); }}
                    >
                      Izmeni
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDeleteAnnouncement(a.id)}
                    >
                      Obriši
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <AnnouncementModal
        isOpen={announcementModalOpen}
        onClose={() => setAnnouncementModalOpen(false)}
        onSave={handleSaveAnnouncement}
        initialData={editingAnnouncement || undefined}
        courseId={courseId}
      />
    </div>
  );
}
