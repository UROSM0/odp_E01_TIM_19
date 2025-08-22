import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validacijaPodatakaAuth } from "../../api_services/validators/auth/AuthValidator";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import type { CourseDto } from "../../models/courses/CourseDto";
import { coursesApi } from "../../api_services/courses/CoursesAPIService";
import { jwtDecode } from "jwt-decode";
import type { JwtTokenClaims } from "../../types/auth/JwtTokenClaims";

export function RegistracijaForma({ authApi }: AuthFormProps) {
  const navigate = useNavigate();
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [uloga, setUloga] = useState("student");
  const [greska, setGreska] = useState("");
  const [kursevi, setKursevi] = useState<CourseDto[]>([]);
  const [izabraniKursevi, setIzabraniKursevi] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      const data = await coursesApi.getAllCourses();
      setKursevi(data);
    })();
  }, []);

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();
    const validacija = validacijaPodatakaAuth(korisnickoIme, lozinka);
    if (!validacija.uspesno) {
      setGreska(validacija.poruka ?? "Neispravni podaci");
      return;
    }

    if (izabraniKursevi.length === 0) {
      setGreska("Morate izabrati najmanje jedan kurs.");
      return;
    }

    if (izabraniKursevi.length > 3) {
      setGreska("Možete izabrati najviše 3 kursa.");
      return;
    }

    const odgovor = await authApi.registracija(korisnickoIme, lozinka, uloga);
    if (!odgovor.success) {
      setGreska(odgovor.message);
      return;
    }

    const newToken: string = odgovor.data!;
    try {
      const decoded = jwtDecode<JwtTokenClaims>(newToken);
      const userId = decoded.id;

      for (const courseId of izabraniKursevi) {
        await coursesApi.enrollUser(userId, courseId, uloga, newToken);
      }

      navigate("/login");
    } catch (error) {
      console.error("Greška pri registraciji/enroll:", error);
      setGreska("Došlo je do greške prilikom upisa u kurseve.");
    }
  };

  const toggleKurs = (id: number) => {
    setIzabraniKursevi((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 3 ? prev : [...prev, id]
    );
  };

  return (
    <div className="bg-white/40 backdrop-blur-lg shadow-lg rounded-3xl p-12 w-full max-w-md border border-white/30">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Registracija</h1>
      <form onSubmit={podnesiFormu} className="space-y-5">
        <input
          type="text"
          placeholder="Korisničko ime"
          value={korisnickoIme}
          onChange={(e) => setKorisnickoIme(e.target.value)}
          className="w-full bg-white px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
        />
        <input
          type="password"
          placeholder="Lozinka"
          value={lozinka}
          onChange={(e) => setLozinka(e.target.value)}
          className="w-full bg-white px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
        />
        <select
          value={uloga}
          onChange={(e) => setUloga(e.target.value)}
          className="w-full bg-white px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
        >
          <option value="student">Student</option>
          <option value="professor">Profesor</option>
        </select>

        <div className="flex flex-col gap-2 max-h-44 overflow-y-auto border border-gray-300 p-3 rounded-2xl bg-white/30 backdrop-blur-sm">
          {kursevi.map((kurs) => (
            <label key={kurs.id} className="flex items-center gap-2 text-gray-800">
              <input
                type="checkbox"
                checked={izabraniKursevi.includes(kurs.id)}
                onChange={() => toggleKurs(kurs.id)}
                className="accent-blue-500"
              />
              {kurs.name}
            </label>
          ))}
        </div>

        {greska && <p className="text-center text-red-600 font-medium">{greska}</p>}

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 font-semibold text-lg hover:from-yellow-400 hover:to-orange-500 transition shadow-md"
        >
          Registruj se
        </button>
      </form>
      <p className="text-center text-sm text-gray-700 mt-6">
        Već imate nalog?{" "}
        <Link to="/login" className="text-yellow-600 hover:text-yellow-500 font-medium">
          Prijavite se
        </Link>
      </p>
    </div>
  );
}
