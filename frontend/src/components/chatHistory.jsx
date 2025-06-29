"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";

export default function ChatHistory({ refreshTrigger = 0 }) {
  const [chats, setChats] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const currentChatId = pathname.split("/")[2]; // Extrae el chatId de /chat/[id]

  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/resumenes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChats(res.data);
      } catch (err) {
        console.error("Error al cargar historial de chats:", err.message);
      }
    };

    fetchChats();
  }, [refreshTrigger]); // Se actualiza cada vez que cambia

  const handleSelectChat = (chatId) => {
    router.push(`/chat/${chatId}`);
  };

  return (
    <aside className="w-full sm:w-72 bg-zinc-900 p-4 text-white overflow-y-auto h-full">
      <h2 className="text-lg font-bold mb-4">Historial</h2>
      <ul className="space-y-2">
        {chats.length === 0 ? (
          <p className="text-gray-400">No hay chats previos</p>
        ) : (
          chats.map((chat) => (
            <li
              key={chat.chatId}
              onClick={() => handleSelectChat(chat.chatId)}
              className={`cursor-pointer p-2 rounded transition ${
                currentChatId === String(chat.chatId)
                  ? "bg-zinc-800 font-semibold"
                  : "hover:bg-zinc-800"
              }`}
            >
              <div className="text-sm truncate">{chat.primerMensaje}</div>
              <div className="text-xs text-gray-400">
                {new Date(chat.fecha).toLocaleString()}
              </div>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}
