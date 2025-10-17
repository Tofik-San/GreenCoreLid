export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center py-16 text-center">
      <h1 className="text-5xl font-bold mb-6 text-green-300">🌱 О проекте GreenCore</h1>
      <p className="max-w-3xl text-gray-400">
        GreenCore — цифровое ядро ботанических данных, объединяющее агротехнику,
        реальный опыт ухода и научные источники.  
        Платформа создана для точного управления зелёными экосистемами и
        систематизации знаний о растениях.
      </p>
      <p className="mt-6 text-gray-500 text-sm">© 2025 GreenCore Labs</p>
    </div>
  );
}
