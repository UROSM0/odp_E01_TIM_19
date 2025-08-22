import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { coursesApi } from "../../api_services/courses/CoursesAPIService";
import { announcementsApi } from "../../api_services/announcements/AnnouncementsAPIService";
import { materialsApi } from "../../api_services/materials/MaterialsAPIService";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { AnnouncementDto } from "../../models/announcements/AnnouncementDto";
import type { MaterialDto } from "../../models/materials/MaterialDto";
import { AnnouncementsSection } from "./AnnouncementsSection";
import { MaterialsSection } from "./MaterialsSection";

export function CourseForma() {
  const { id } = useParams<{ id: string }>();
  const courseId = Number(id);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState("");
  const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
  const [materials, setMaterials] = useState<MaterialDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementDto | null>(null);

  const [materialModalOpen, setMaterialModalOpen] = useState(false);

  // Blokada scrolla tela kada je modal otvoren
  useEffect(() => {
    if (announcementModalOpen || materialModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [announcementModalOpen, materialModalOpen]);

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
        console.error("[CourseForma] Greška pri učitavanju kursa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, token]);

  if (loading) return <div className="text-center text-white mt-20">Učitavanje kursa...</div>;

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
    <div className="bg-white/30 backdrop-blur-lg shadow-lg rounded-3xl p-8 w-full max-w-6xl mx-auto border border-white/30">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">{courseName}</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="py-2 px-5 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 font-semibold hover:from-yellow-400 hover:to-orange-500 transition shadow-md"
        >
          ⬅ Nazad
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Leva strana - Obaveštenja */}
        <div className="flex-1 bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-inner max-h-[600px] overflow-y-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-yellow-600 border-b-2 border-yellow-400 pb-2 shadow-sm">
            Obaveštenja
          </h2>

          <AnnouncementsSection
            announcements={announcements}
            user={user}
            token={token}
            courseId={courseId}
            onSave={handleSaveAnnouncement}
            onDelete={handleDeleteAnnouncement}
            modalOpen={announcementModalOpen}
            setModalOpen={setAnnouncementModalOpen}
            editingAnnouncement={editingAnnouncement}
            setEditingAnnouncement={setEditingAnnouncement}
          />
        </div>

        {/* Desna strana - Materijali */}
        <div className="flex-1 bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-inner max-h-[600px] overflow-y-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-yellow-600 border-b-2 border-yellow-400 pb-2 shadow-sm">
            Materijali
          </h2>

          <MaterialsSection
            materials={materials}
            user={user}
            courseId={courseId}
            onSave={handleSaveMaterial}
            onDelete={handleDeleteMaterial}
            modalOpen={materialModalOpen}
            setModalOpen={setMaterialModalOpen}
          />
        </div>
      </div>
    </div>
  );
}
