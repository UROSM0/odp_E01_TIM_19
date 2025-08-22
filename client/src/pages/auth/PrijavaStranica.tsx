import { PrijavaForma } from "../../components/auth/PrijavaForma";
import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";

interface LoginPageProps {
  authApi: IAuthAPIService;
}

export default function PrijavaStranica({ authApi }: LoginPageProps) {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-orange-100 via-orange-200 to-orange-300 flex items-center justify-center">
      <PrijavaForma authApi={authApi} />
    </main>
  );
}
