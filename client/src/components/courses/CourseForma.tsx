import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { coursesApi } from "../../api_services/courses/CoursesAPIService";
import type { CourseDto } from "../../models/courses/CourseDto";
import type { EnrollmentDto } from "../../models/enrollments/EnrollmentDto";

export function CoursePage() {
  const { id } = useParams(); // ID kursa iz URL-a
  const { token, user } = useAuth();
  const [course, setCourse] = useState<CourseDto | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentDto | null>(null);

  useEffect(() => {
    if (!id || !token || !user) return;

    const fetchCourse = async () => {
      try {
        // Dohvatanje informacija o kursu
        const courseData = await coursesApi.getCourseById(Number(id));
        setCourse(courseData);

        // Pronađi enrollment korisnika za ovaj kurs
        const enrollmentsRes = await fetch(`${import.meta.env.VITE_API_URL}enrollments/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await enrollmentsRes.json();
        const userEnrollment = data.courses.find((c: EnrollmentDto) => c.courseId === Number(id));
        setEnrollment(userEnrollment || null);
      } catch (error) {
        console.error("Greška pri učitavanju kursa:", error);
      }
    };

    fetchCourse();
  }, [id, token, user]);

  if (!course || !enrollment) return <p>Učitavanje kursa...</p>;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
      <p className="mb-6">Vaša uloga: <strong>{enrollment.role}</strong></p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Obaveštenja</h2>
        <p>Ovde će biti lista obaveštenja kursa...</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Nastavni materijali</h2>
        <p>Ovde će biti lista materijala kursa...</p>
      </section>
    </div>
  );
}
