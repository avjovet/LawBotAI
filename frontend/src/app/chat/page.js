"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No tienes sesión iniciada.");
      return;
    }

    // 💬 Mostrar el mensaje del usuario inmediatamente
    const userMessage = {
      rol: "user",
      contenido: input,
    };

    // 🕓 Mostrar mensaje temporal del asistente
    const loadingMessage = {
      rol: "assistant",
      contenido: "Escribiendo respuesta...",
      temporal: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
        { prompt: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const backendMessages = res.data.messages;

      // Reemplazar el mensaje "temporal" con el real
      const aiMessage = backendMessages.find((msg) => msg.rol === "assistant");

      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.temporal);
        return [...filtered, aiMessage];
      });
    } catch (err) {
      console.error("Error al enviar mensaje:", err.response?.data || err.message);

      // 💬 Mensaje alternativo como si lo dijera el asistente
      const fallbackMessage = {
        rol: "assistant",
        contenido: err.response?.data?.message || "⚠️ Ocurrió un error al comunicarse con LawBot.",
      };

      // 🔄 Remover mensaje temporal y agregar el mensaje de error
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.temporal);
        return [...filtered, fallbackMessage];
      });
}
  };


  return (
    <section className="flex flex-col h-[calc(100vh-160px)] max-w-2xl mx-auto px-4 py-6 text-white">
      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.rol === "user"
                ? "bg-zinc-800 self-end text-right"
                : "bg-transparent self-start"
            }`}
          >
            <p>{msg.contenido}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="mt-4 flex">
        <input
          type="text"
          className="flex-1 p-2 rounded-l bg-black border border-gray-400 text-white focus:outline-none"
          placeholder="Escribe tu consulta legal..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gray-400 text-black font-semibold px-4 rounded-r hover:bg-white transition"
        >
          Enviar
        </button>
      </form>
    </section>
  );
}
