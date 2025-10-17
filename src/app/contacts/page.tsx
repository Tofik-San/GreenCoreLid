export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center py-16 text-center">
      <h1 className="text-5xl font-bold mb-6 text-green-300">📞 Контакты</h1>
      <p className="text-gray-400 mb-4">
        Свяжитесь с нами по вопросам интеграции или партнёрства.
      </p>
      <div className="space-y-2">
        <p>✉️ support@greencore.io</p>
        <p>🌐 Telegram: @GreenCoreBot</p>
        <p>📍 Europe / Remote</p>
      </div>
    </div>
  );
}
