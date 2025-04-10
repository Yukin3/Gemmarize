import { Outlet } from "react-router-dom";

export default function Auth() {
  return (
    <div className="relative min-h-screen">
      <main className="p-4 pt-24 flex items-center justify-center">
      <Outlet /> {/* Child (auth) pages */}
      </main>

    </div>
  );
}
