import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { Link, useNavigate } from "react-router-dom";

export function Dashboard() {
  const { token, user, logout } = useAuth(); // 👈 dodali logout iz hook-a
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user) {
      console.log("Nema tokena ili user-a:", { token, user });
      return;
    }

    const fetchEnrollments = async () => {
      try {
        console.log("Šaljemo request sa tokenom:", token);
        const res = await fetch(`${import.meta.env.VITE_API_URL}enrollments/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Status odgovora:", res.status);
        const data = await res.json();
        console.log("Podaci sa servera:", data);
        setEnrollments(data.courses || []);
      } catch (error) {
        console.error("Greška pri učitavanju kurseva:", error);
      }
    };

    fetchEnrollments();
  }, [token, user]);

  if (!user) return null;

  const handleLogout = () => {
    logout();          // očisti token i user-a iz state-a / localStorage-a
    navigate("/login"); // preusmeri na login stranicu
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Dobrodošli, {user.korisnickoIme}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      
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
