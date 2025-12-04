import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
