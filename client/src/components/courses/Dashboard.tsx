import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { Link } from "react-router-dom";

export function Dashboard() {
  const { token, user } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    if (!token || !user) {
      console.log("Nema tokena ili user-a:", { token, user }); // 👈 LOG 1
      return;
    }

    const fetchEnrollments = async () => {
      try {
        console.log("Šaljemo request sa tokenom:", token); // 👈 LOG 2
        const res = await fetch(`${import.meta.env.VITE_API_URL}enrollments/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Status odgovora:", res.status); // 👈 LOG 3
        const data = await res.json();
        console.log("Podaci sa servera:", data); // 👈 LOG 4
        setEnrollments(data.courses || []);
      } catch (error) {
        console.error("Greška pri učitavanju kurseva:", error);
      }
    };

    fetchEnrollments();
  }, [token, user]);

  if (!user) return null;

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dobrodošli, {user.korisnickoIme}</h1>
      
      <h2 className="text-2xl mb-4">Vaši kursevi:</h2>
      <ul className="list-disc list-inside space-y-2">
        {enrollments.map((e: any) => (
          <li key={e.courseId}>
            <Link to={`/courses/${e.courseId}`} className="text-blue-600 hover:underline">
              {e.courseName}
            </Link> ({e.role})
          </li>
        ))}
      </ul>
    </div>
  );
}
