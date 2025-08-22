import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { Link, useNavigate } from "react-router-dom";

export function Dashboard() {
  const { token, user, logout } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user) return;

    const fetchEnrollments = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}enrollments/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEnrollments(data.courses || []);
      } catch (error) {
        console.error("Greška pri učitavanju kurseva:", error);
      }
    };

    fetchEnrollments();
  }, [token, user]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-white/30 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-4xl border border-white/20">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Dobrodošli, {user.korisnickoIme}!
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Vaši kursevi</h2>

      {enrollments.length === 0 ? (
        <p className="text-gray-600">Još uvek niste upisani ni na jedan kurs.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {enrollments.map((e: any) => (
            <Link
              to={`/courses/${e.courseId}`}
              key={e.courseId}
              className="bg-white/50 backdrop-blur-md rounded-xl shadow-md p-4 hover:shadow-xl transition flex flex-col justify-between"
            >
              <h3 className="text-xl font-semibold text-gray-800">{e.courseName}</h3>
              <p className="text-gray-600 mt-2">Uloga: {e.role}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
