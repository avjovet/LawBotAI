"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isChatPage = pathname === "/chat";

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verifica si hay token
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="bg-black text-white shadow p-4">
      <div className="flex justify-between items-center text-sm font-bold px-4">
        <Link href="/" className="hover:text-gray-300 transition">
          LawBot AI
        </Link>

        {isChatPage && isLoggedIn ? (
          <button onClick={handleLogout} className="hover:text-red-400 transition">
            Cerrar sesión
          </button>
        ) : (
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-gray-300 transition">
              Iniciar sesión
            </Link>
            <Link href="/register" className="hover:text-gray-300 transition">
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
