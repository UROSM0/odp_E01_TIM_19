import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { coursesApi } from "../../api_services/courses/CoursesAPIService";
import type { EnrollmentDto } from "../../models/enrollments/EnrollmentDto";
import type { CourseDto } from "../../models/courses/CourseDto";
import { Link } from "react-router-dom";

export function Dashboard() {
  const { token, user } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentDto[]>([]);
  const [courses, setCourses] = useState<CourseDto[]>([]);

  useEffect(() => {
    if (!token || !user) return;

    const fetchData = async () => {
      try {
        const sviKursevi = await coursesApi.getAllCourses();
        setCourses(sviKursevi);

        const res = await fetch(`${import.meta.env.VITE_API_URL}enrollments/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userEnrollments: EnrollmentDto[] = await res.json();
        setEnrollments(userEnrollments);
      } catch (error) {
        console.error("Greška pri učitavanju dashboard-a:", error);
      }
    };

    fetchData();
  }, [token, user]);

  const getCourseName = (courseId: number) => {
    return courses.find(c => c.id === courseId)?.name || "Nepoznat kurs";
  };

  if (!user) return null; // ili neki loader

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dobrodošli, {user.korisnickoIme}</h1>
      
      <h2 className="text-2xl mb-4">Vaši kursevi:</h2>
      <ul className="list-disc list-inside space-y-2">
        {enrollments.map(e => (
          <li key={e.courseId}>
            <Link
              to={`/courses/${e.courseId}`}
              className="text-blue-600 hover:underline"
            >
              {getCourseName(e.courseId)}
            </Link> ({e.role})
          </li>
        ))}
      </ul>
    </div>
  );
}
