import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { coursesApi } from "../../api_services/courses/CoursesAPIService";
import { announcementsApi } from "../../api_services/announcements/AnnouncementsAPIService";
import { materialsApi } from "../../api_services/materials/MaterialsAPIService";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { AnnouncementDto } from "../../models/announcements/AnnouncementDto";
import type { MaterialDto } from "../../models/materials/MaterialDto";
import { AnnouncementModal } from "../modals/AnnouncementModal";
import { MaterialModal } from "../modals/MaterialModal";

export function CourseForma() {
  const { id } = useParams<{ id: string }>();
  const courseId = Number(id);
  const { token, user } = useAuth();

  const [courseName, setCourseName] = useState("");
  const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
  const [materials, setMaterials] = useState<MaterialDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementDto | null>(null);

  const [materialModalOpen, setMaterialModalOpen] = useState(false);

  useEffect(() => {
    if (!courseId || !token) return;

    const fetchData = async () => {
      try {
        const course = await coursesApi.getCourseById(courseId);
        setCourseName(course?.name || "Nepoznat kurs");

        const fetchedAnnouncements = await announcementsApi.getAnnouncementsByCourse(courseId, token);
        setAnnouncements(fetchedAnnouncements);

        const fetchedMaterials = await materialsApi.getMaterialsByCourse(courseId, token);
        setMaterials(fetchedMaterials);
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
    if (!token || !window.confirm("Da li si siguran da želiš da obrišeš ovu objavu?")) return;
    const success = await announcementsApi.deleteAnnouncement(id, token);
    if (success) setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const handleSaveMaterial = (m: MaterialDto) => {
    setMaterials(prev => [m, ...prev]);
    setMaterialModalOpen(false);
  };

  const handleDeleteMaterial = async (id: number) => {
    if (!token || !window.confirm("Da li si siguran da želiš da obrišeš ovaj materijal?")) return;
    const success = await materialsApi.deleteMaterial(id, token);
    if (success) setMaterials(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{courseName}</h1>

      {/* Objave */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Objave</h2>
          {user?.uloga === "professor" && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => { setEditingAnnouncement(null); setAnnouncementModalOpen(true); }}
            >+ Dodaj objavu</button>
          )}
        </div>
        {announcements.length === 0 ? <p>Nema objava za ovaj kurs.</p> : (
          <ul className="space-y-4">
            {announcements.map(a => (
              <li key={a.id} className="border p-4 rounded shadow-sm flex items-start gap-4">
                {a.imageUrl && <img src={`http://localhost:4000/${a.imageUrl}`} alt="Objava" className="w-24 h-24 object-cover rounded flex-shrink-0" />}
                <div className="flex-1">{a.text}</div>
                {user?.uloga === "professor" && (
                  <div className="flex flex-col gap-2">
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => { setEditingAnnouncement(a); setAnnouncementModalOpen(true); }}>Izmeni</button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDeleteAnnouncement(a.id)}>Obriši</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Materijali */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Materijali</h2>
          {user?.uloga === "professor" && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setMaterialModalOpen(true)}>
              + Dodaj materijal
            </button>
          )}
        </div>
        {materials.length === 0 ? <p>Nema materijala za ovaj kurs.</p> : (
          <ul className="space-y-4">
            {materials.map(m => (
              <li key={m.id} className="border p-4 rounded shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-semibold">{m.title}</p>
                  {m.description && <p>{m.description}</p>}
                  <a href={`http://localhost:4000/${m.filePath}`} target="_blank" className="text-blue-600 underline">Preuzmi fajl</a>
                </div>
                {user?.uloga === "professor" && (
                  <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDeleteMaterial(m.id)}>Obriši</button>
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

      <MaterialModal
        isOpen={materialModalOpen}
        onClose={() => setMaterialModalOpen(false)}
        onSave={handleSaveMaterial}
        courseId={courseId}
      />
    </div>
  );
}
