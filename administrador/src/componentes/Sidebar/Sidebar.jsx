import { Avatar } from "@heroui/react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { path: "/dashboard", label: "Dashboard", icon: "ri-dashboard-line" },
    { path: "/enrolamiento", label: "Enrolamiento", icon: "ri-user-add-line" },
    { path: "/reportes", label: "Reportes", icon: "ri-bar-chart-line" },
    { path: "/productos", label: "Productos", icon: "ri-store-2-line" },
  ];

  return (
    <div className="h-screen w-64 p-6 bg-white/50 backdrop-blur-2xl shadow-lg border-r border-white/40 flex flex-col">
      
      {/* Avatar + nombre animado */}
      <div className="flex flex-col items-center mt-4 mb-10">
        <Avatar
          src="https://i.pravatar.cc/150?img=68"
          size="lg"
          isBordered
          className="border-[3px]"
          style={{ borderColor: "#E81236" }}
        />

        {/* Texto animado HeroUI (fade infinito) */}
        <p className="text-lg font-semibold mt-3 text-[#E81236] animate-pulse">
          Carlos López
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2">
        {menu.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-xl text-[0.95rem] font-medium
                transition-all duration-300
                ${
                  active
                    ? "text-white shadow-md scale-[1.03]"
                    : "hover:scale-[1.03] text-slate-700 hover:text-[#E81236]"
                }
                `}
              style={{
                backgroundColor: active ? "#E81236" : "transparent",
              }}
            >
              <i className={`${item.icon} text-[1.2rem]`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer opcional */}
      <div className="mt-auto opacity-40 text-xs text-center">
        <p>© 2025</p>
      </div>
    </div>
  );
}
