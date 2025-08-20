import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  const [courseName, setCourseName] = useState("");
  const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
  const [materials, setMaterials] = useState<MaterialDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementDto | null>(null);

  const [materialModalOpen, setMaterialModalOpen] = useState(false);

  useEffect(() => {
    console.log("[CourseForma] fetching course data", { courseId, token });
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

      <AnnouncementsSection
        announcements={announcements}
        user={user}
        token={token}        // dodato
        courseId={courseId}
        onSave={handleSaveAnnouncement}
        onDelete={handleDeleteAnnouncement}
        modalOpen={announcementModalOpen}
        setModalOpen={setAnnouncementModalOpen}
        editingAnnouncement={editingAnnouncement}
        setEditingAnnouncement={setEditingAnnouncement}
      />

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
  );
}
