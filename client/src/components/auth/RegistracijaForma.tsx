import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { validacijaPodatakaAuth } from "../../api_services/validators/auth/AuthValidator";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { CourseDto } from "../../models/courses/CourseDto";
import { coursesApi } from "../../api_services/courses/CoursesAPIService";
import { jwtDecode } from "jwt-decode";
import type { JwtTokenClaims } from "../../types/auth/JwtTokenClaims";

export function RegistracijaForma({ authApi }: AuthFormProps) {
  const {login} = useAuth();
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [uloga, setUloga] = useState("student");
  const [greska, setGreska] = useState("");

  const [kursevi, setKursevi] = useState<CourseDto[]>([]);
  const [izabraniKursevi, setIzabraniKursevi] = useState<number[]>([]);

  // useEffect za učitavanje kurseva sa servera
useEffect(() => {
  (async () => {
    const data = await coursesApi.getAllCourses(); // ukloni token
    setKursevi(data);
  })();
}, []);

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validacija korisničkih podataka
    const validacija = validacijaPodatakaAuth(korisnickoIme, lozinka);
    if (!validacija.uspesno) {
      setGreska(validacija.poruka ?? "Неисправни подаци");
      return;
    }

    if (izabraniKursevi.length === 0) {
      setGreska("Морате изабрати најмање један курс.");
      return;
    }

    if (izabraniKursevi.length > 3) {
      setGreska("Можете изабрати највише 3 курса.");
      return;
    }

    // Registracija korisnika
    const odgovor = await authApi.registracija(korisnickoIme, lozinka, uloga);
   if (!odgovor.success) {
  setGreska(odgovor.message);
  return;
}

const newToken: string = odgovor.data!;

    try {
      // Dekodiraj token da dobijemo ID korisnika
      const decoded = jwtDecode<JwtTokenClaims>(newToken);
      const userId = decoded.id;

      // Upis u enrollments
      for (const courseId of izabraniKursevi) {
        await coursesApi.enrollUser(userId, courseId, uloga, newToken);
      }

      // Nakon što su upisi u enrollments uspešni
      login(newToken);
    } catch (error) {
      console.error("Greška pri registraciji/enroll:", error);
      setGreska("Došlo je do greške prilikom upisa u kurseve.");
    }
  };

  const toggleKurs = (id: number) => {
    setIzabraniKursevi((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      } else {
        if (prev.length >= 3) return prev; // ograničenje na 3 kursa
        return [...prev, id];
      }
    });
  };

  return (
    <div className="bg-white/30 backdrop-blur-lg shadow-xl rounded-2xl p-10 w-full max-w-md border border-white/20">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Регистрација</h1>
      <form onSubmit={podnesiFormu} className="space-y-4">
        <input
          type="text"
          placeholder="Корисничко име"
          value={korisnickoIme}
          onChange={(e) => setKorisnickoIme(e.target.value)}
          className="w-full bg-white/40 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Лозинка"
          value={lozinka}
          onChange={(e) => setLozinka(e.target.value)}
          className="w-full bg-white/40 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        
        <select
          value={uloga}
          onChange={(e) => setUloga(e.target.value)}
          className="w-full bg-white/40 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="student">Student</option>
          <option value="professor">Profesor</option>
        </select>
        
        {/* Lista kurseva sa checkbox-ovima */}
        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto border p-2 rounded">
          {kursevi.map((kurs) => (
            <label key={kurs.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={izabraniKursevi.includes(kurs.id)}
                onChange={() => toggleKurs(kurs.id)}
              />
              {kurs.name}
            </label>
          ))}
        </div>

        {greska && <p className="text-md text-center text-red-700/80 font-medium">{greska}</p>}

        <button
          type="submit"
          className="w-full bg-blue-700/70 hover:bg-blue-700/90 text-white py-2 rounded-xl transition"
        >
          Региструј се
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Већ имате налог?{" "}
        <Link to="/login" className="text-blue-700 hover:underline">
          Пријавите се
        </Link>
      </p>
    </div>
  );
}
