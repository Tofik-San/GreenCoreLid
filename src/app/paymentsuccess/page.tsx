export default function PaymentSuccess() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-green-400 text-center">
      <h1 className="text-5xl font-bold mb-8 drop-shadow-[0_0_12px_rgba(83,255,148,0.7)]">
        Оплата прошла успешно
      </h1>
      <p className="text-lg text-green-200 max-w-md">
        Благодарим за оплату. Ваш API-ключ активирован и уже доступен в системе.
      </p>
      <a
        href="/docs"
        className="mt-10 px-8 py-4 bg-green-700/40 rounded-2xl hover:bg-green-600/60 transition"
      >
        Вернуться в документацию API
      </a>
    </main>
  );
}
