import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validacijaPodatakaAuth } from "../../api_services/validators/auth/AuthValidator";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { useAuth } from "../../hooks/auth/useAuthHook";

export function PrijavaForma({ authApi }: AuthFormProps) {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();

    const validacija = validacijaPodatakaAuth(korisnickoIme, lozinka);
    if (!validacija.uspesno) {
      setGreska(validacija.poruka ?? "Неисправни подаци");
      return;
    }

    const odgovor = await authApi.prijava(korisnickoIme, lozinka);
    if (odgovor.success && odgovor.data) {
      login(odgovor.data);
      navigate("/dashboard");
    } else {
      setGreska(odgovor.message);
      setKorisnickoIme("");
      setLozinka("");
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-lg shadow-lg rounded-3xl p-12 w-full max-w-md border border-white/30">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        Prijava
      </h1>
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
        {greska && <p className="text-center text-red-600 font-medium">{greska}</p>}
        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 font-semibold text-lg hover:from-yellow-400 hover:to-orange-500 transition shadow-md"
        >
          Prijavi se
        </button>
      </form>
      <p className="text-center text-sm text-gray-700 mt-6">
        Nemate nalog?{" "}
        <Link to="/register" className="text-yellow-600 hover:text-yellow-500 font-medium">
          Registrujte se
        </Link>
      </p>
    </div>
  );
}
