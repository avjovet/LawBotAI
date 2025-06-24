"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";        // ← Descomenta cuando el backend esté listo
import { saveToken } from "../../../utils/auth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    // ✅ Revisa en consola lo que se enviará
    console.log("Payload enviado:", { name, email, password });

    
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        { name, email, password }
      );
      console.log("Registro enviado:", res.data);
      saveToken(res.data.token);
      window.location.href = "/chat";                 // redirige al chat
    } catch (err) {
      console.error("Error al registrarse:", err);
      alert("Error al registrarse (backend aún no responde)");
    }
    
    
    alert("Registro exitoso (simulado)");
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-white">Crear cuenta</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Nombre completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl bg-black border border-gray-400 p-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

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
            Registrarse
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-white hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </section>
  );
}