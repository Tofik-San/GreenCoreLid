export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="gc-title text-4xl mb-6">О проекте</h1>
      <p className="max-w-2xl text-green-200 leading-relaxed">
        <strong>GreenCore</strong> — это цифровое ядро растительного мира.
        Проект объединяет ботанические данные, агротехнические знания и
        современные технологии для создания устойчивых экосистем.  
        Здесь разрабатываются API, базы данных и инструменты, помогающие
        анализировать, подбирать и интегрировать растения в цифровую среду.
      </p>
    </main>
  );
}
