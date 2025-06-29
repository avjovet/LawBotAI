"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ChatHistory from "@/components/ChatHistory"; // Asegúrate de que esta ruta sea correcta

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0); // 🔁 Trigger para actualizar historial
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

    const userMessage = {
      rol: "user",
      contenido: input,
    };

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
      const aiMessage = backendMessages.find((msg) => msg.rol === "assistant");

      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.temporal);
        return [...filtered, aiMessage];
      });

      // 🔄 Refrescar historial al crear nuevo chat
      setRefreshTrigger((prev) => prev + 1);

    } catch (err) {
      console.error("Error al enviar mensaje:", err.response?.data || err.message);

      const fallbackMessage = {
        rol: "assistant",
        contenido:
          err.response?.data?.message ||
          "⚠️ Ocurrió un error al comunicarse con LawBot.",
      };

      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.temporal);
        return [...filtered, fallbackMessage];
      });
    }
  };

  return (
    <div className="flex h-screen">
      <ChatHistory refreshTrigger={refreshTrigger} />

      <section className="flex flex-col flex-1 h-full px-4 py-6 text-white bg-black">
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
    </div>
  );
}
