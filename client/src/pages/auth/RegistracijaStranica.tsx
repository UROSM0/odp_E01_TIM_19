import { RegistracijaForma } from "../../components/auth/RegistracijaForma";
import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";

interface RegistracijaPageProps {
  authApi: IAuthAPIService;
}

export default function RegistracijaStranica({ authApi }: RegistracijaPageProps) {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-orange-800/70 flex items-center justify-center">
      <RegistracijaForma authApi={authApi} />
    </main>
  );
}
