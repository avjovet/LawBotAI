"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";       

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // ✅ Revisa en consola lo que se enviará
    console.log("Payload enviado:", { email, password });

    
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        { email, password }
      );
      console.log("Login enviado:", res.data);
      // localStorage.setItem("token", res.data.token); // ejemplo
      window.location.href = "/chat";                 // redirige al chat
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      alert("Error al iniciar sesión (backend aún no responde)");
    }
  

    alert("Inicio de sesión exitoso (simulado)");
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-white">Iniciar sesión</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl bg-black border border-gray-400 p-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl bg-black border border-gray-400 p-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl border border-gray-400 text-white font-semibold py-2 hover:bg-gray-400 hover:text-black transition"
          >
            Ingresar
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-white hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </section>
  );
}
