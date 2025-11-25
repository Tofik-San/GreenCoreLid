"use client";

export default function TermsPage() {
  return (
    <main className="min-h-screen px-8 py-20 text-green-100 bg-[var(--gc-bg)]">
      <div className="max-w-4xl mx-auto text-left leading-relaxed">
        <h1 className="text-5xl font-bold text-green-400 mb-10 drop-shadow-[0_0_12px_rgba(83,255,148,0.5)]">
          Условия пользования
        </h1>

        <p className="text-green-300 mb-6">
          <strong>Дата обновления:</strong> 28 октября 2025 г.<br />
          <strong>Владелец:</strong> GreenCore.<br />
          <strong>Контакты:</strong>{" "}
          <a
            href="https://t.me/BOTanikPlants"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 underline hover:text-green-300"
          >
            @greencore_support
          </a>{" "}
          — служба поддержки пользователей.
        </p>

        <section className="space-y-6 text-green-200">
          <div>
            <h2 className="text-2xl text-green-400 mb-2">1. Общие положения</h2>
            <p>
              Настоящие Условия регулируют использование сайта и API-платформы GreenCore.
              Используя сервис, вы подтверждаете согласие с настоящими правилами.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-green-400 mb-2">2. Описание сервиса</h2>
            <p>
              GreenCore предоставляет доступ к базе ботанических данных и API для интеграции карточек растений.
              Доступ осуществляется через публичные или персональные ключи с лимитами.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-green-400 mb-2">3. Права и обязанности пользователей</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>использовать сервис добросовестно и без обхода ограничений;</li>
              <li>не пытаться получить несанкционированный доступ к данным или коду;</li>
              <li>не использовать API для конкурирующих проектов без разрешения владельца.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl text-green-400 mb-2">4. Ограничение ответственности</h2>
            <p>
              Сервис предоставляется «как есть». GreenCore не несёт ответственности за сбои,
              перерывы или убытки, возникшие при использовании данных платформы.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-green-400 mb-2">5. Интеллектуальная собственность</h2>
            <p>
              Контент, код и база данных GreenCore защищены авторским правом.
              Копирование или перепродажа без письменного разрешения запрещены.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-green-400 mb-2">6. Изменения условий</h2>
            <p>
              Условия могут обновляться без предварительного уведомления.
              Актуальная версия всегда размещается на сайте.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
