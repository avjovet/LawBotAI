"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isChatPage = pathname === "/chat";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/protected/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const nombre = res.data.user?.nombre || res.data.user?.email || "";
          setUserName(nombre);
        })
        .catch((err) => {
          console.error("Error al obtener el usuario:", err);
          setIsLoggedIn(false);
        });
    }
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
          //////////////////////////////
          <div className="flex items-center gap-4">
            <span className="text-gray-300"> {userName}</span>
            <button onClick={handleLogout} className="hover:text-red-400 transition">
              Cerrar sesión
            </button>
          </div>
          ///////////////////////////////////
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
