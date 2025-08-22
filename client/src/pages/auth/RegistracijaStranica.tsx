import { RegistracijaForma } from "../../components/auth/RegistracijaForma";
import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";

interface RegistracijaPageProps {
  authApi: IAuthAPIService;
}

export default function RegistracijaStranica({ authApi }: RegistracijaPageProps) {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-orange-100 via-orange-200 to-orange-300 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <RegistracijaForma authApi={authApi} />
      </div>
    </main>
  );
}
