import { Dashboard } from "../../components/stranice/Dashboard";


export default function DashboardStranica() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-orange-100 via-orange-200 to-orange-300 flex flex-col items-center pt-16 pb-16">
      <div className="w-full max-w-4xl px-4">
        <Dashboard />
      </div>
    </main>
  );
}
