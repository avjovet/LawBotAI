"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isChatPage = pathname === "/chat";

  return (
    <nav className="bg-black text-white shadow p-4">
      <div className="flex justify-between items-center text-sm font-bold px-4">
        <Link href="/" className="hover:text-gray-300 transition">
          LawBot AI
        </Link>
        {!isChatPage && (
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-gray-300 transition">Iniciar sesión</Link>
            <Link href="/register" className="hover:text-gray-300 transition">Registrarse</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
