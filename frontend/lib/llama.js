import { ChatOpenAI } from "langchain/chat_models/openai";

const llama = new ChatOpenAI({
  baseUrl: "https://8c93-34-16-192-99.ngrok-free.app/v1", // reemplaza si cambia ngrok
  openAIApiKey: "not-needed", // obligatorio aunque no se use
  temperature: 0.7,
});

export default llama;
