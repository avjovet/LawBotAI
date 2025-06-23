export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-160px)] space-y-4 px-4">
      <h1 className="text-3xl font-bold text-white fade-up">Bienvenido a LawBot AI</h1>
      <p className="text-gray-200 fade-up" style={{ animationDelay: "0.2s" }}>
        Nuestra plataforma te brinda asesoría legal automatizada en Derecho Familiar.
      </p>
      <p className="text-gray-400 fade-up" style={{ animationDelay: "0.4s" }}>
        Regístrate o inicia sesión para comenzar.
      </p>
    </section>
  );
}
