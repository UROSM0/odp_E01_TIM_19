import { PrijavaForma } from "../../components/auth/PrijavaForma";
import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";

interface LoginPageProps {
  authApi: IAuthAPIService;
}

export default function PrijavaStranica({ authApi }: LoginPageProps) {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-orange-800/70 flex items-center justify-center">
      <PrijavaForma authApi={authApi} />
    </main>
  );
}
