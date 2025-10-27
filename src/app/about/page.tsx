export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="gc-title text-4xl mb-4">О проекте</h1>
      <p className="max-w-2xl text-green-200 leading-relaxed">
        GreenCore — цифровая система для объединения ботанических данных,
        агротехники и технологий устойчивого озеленения.  
        Здесь развивается ядро API, база растений и интерфейсы управления.
      </p>
    </main>
  );
}
