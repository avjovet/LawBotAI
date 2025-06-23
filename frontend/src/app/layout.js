import "./globals.css";
import Navbar from "../components/Navbar"; // 👈 Importa tu Navbar

export const metadata = {
  title: "RAG Legal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-black text-white">
        <Navbar /> {/* 👈 Navbar inteligente */}

        <main className="flex-1 w-full p-4 bg-black text-white">
          {children}
        </main>

        <footer className="text-center text-sm text-gray-400 py-4">
          © 2025 LawBot AI. Todos los derechos reservados.
        </footer>
      </body>
    </html>
  );
}
