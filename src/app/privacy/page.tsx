"use client";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-8 py-20 text-green-100 bg-[var(--gc-bg)]">
      <div className="max-w-4xl mx-auto text-left leading-relaxed">
        <h1 className="text-5xl font-bold text-green-400 mb-10 drop-shadow-[0_0_12px_rgba(83,255,148,0.5)]">
          Политика конфиденциальности
        </h1>

        <p className="text-green-300 mb-6">
          <strong>Дата обновления:</strong> 28 октября 2025 г.<br />
          <strong>Владелец:</strong> GreenCore.<br />
          <strong>Контакты:</strong>{" "}
          <a
            href="https://t.me/greencore_support"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 underline hover:text-green-300"
          >
            @greencore_support
          </a>{" "}
          — официальный Telegram-канал поддержки.
        </p>

        <section className="space-y-6 text-green-200">
          <div>
            <h2 className="text-2xl text-green-400 mb-2">1. Общие положения</h2>
            <p>
              Настоящая Политика определяет порядок обработки и защиты информации,
              которую пользователи предоставляют при использовании сайта и API-платформы GreenCore.
              Используя сервис, вы подтверждаете согласие с данной Политикой.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-green-400 mb-2">2. Состав собираемых данных</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>технические данные (IP, тип устройства, время запроса);</li>
              <li>данные API-запросов (ключ, частота, параметры фильтрации);</li>
              <li>контактные данные при добровольном обращении в поддержку.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl text-green-400 mb-2">3. Цели обработки</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>обеспечение работы API и корректности лимитов;</li>
              <li>техническая аналитика и предотвращение злоупотреблений;</li>
              <li>обратная связь с пользователями по вопросам работы API.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl text-green-400 mb-2">4. Хранение и защита</h2>
            <p>
              Данные хранятся на защищённых серверах с ограниченным доступом.
              Применяются технические и организационные меры для предотвращения несанкционированного доступа.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-green-400 mb-2">5. Передача данных</h2>
            <p>
              GreenCore не передаёт данные третьим лицам, кроме случаев, предусмотренных законом
              или необходимых для функционирования инфраструктуры (например, облачный хостинг).
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-green-400 mb-2">6. Изменения политики</h2>
            <p>
              Политика может обновляться. Новая версия вступает в силу с момента публикации на сайте.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
