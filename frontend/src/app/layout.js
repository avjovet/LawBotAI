// src/app/layout.js
import "./globals.css";
import Link from "next/link";

export const metadata = { title: "RAG Legal" };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
    <body className="min-h-screen flex flex-col bg-black text-white">
        {/* Navbar */}
       <nav className="bg-black text-white shadow p-4">
        <div className="flex justify-between items-center text-sm font-bold px-4">
          <Link href="/" className="hover:text-gray-300 transition">
            LawBot AI
          </Link>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-gray-300 transition">Iniciar sesión</Link>
            <Link href="/register" className="hover:text-gray-300 transition">Registrarse</Link>
          </div>
        </div>
      </nav>


        {/* Contenido de cada página */}
        <main className="flex-1 w-full p-4 bg-black text-white">
          {children}
        </main>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-400 py-4">
          © 2025 LawBot AI. Todos los derechos reservados.
        </footer>
      </body>
    </html>
  );
}
