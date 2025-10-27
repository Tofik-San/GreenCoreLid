export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="gc-title text-4xl mb-6">Политика конфиденциальности</h1>
      <p className="max-w-2xl text-green-200 leading-relaxed">
        <strong>GreenCore</strong> не собирает личные данные пользователей,
        кроме сведений, необходимых для функционирования API (ключ, лимиты,
        лог запросов).  
        Все данные защищены и не передаются третьим лицам.  
        Использование платформы означает согласие с данной политикой.
      </p>
    </main>
  );
}
