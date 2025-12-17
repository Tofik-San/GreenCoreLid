import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "#a7f3d0",
        textAlign: "center",
        padding: "40px",
      }}
    >
      <div>
        <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>
          Оплата прошла успешно
        </h1>

        <p style={{ fontSize: "18px", marginBottom: "12px" }}>
          API-ключ отправлен на вашу почту.
        </p>

        <p style={{ fontSize: "14px", color: "#6ee7b7" }}>
          Если письмо не пришло, проверьте папку «Спам».
        </p>

        {/* ✅ Кнопка перехода к поиску растений */}
        <div style={{ marginTop: "32px" }}>
          <Link
            href="/search"
            className="gc-btn"
            style={{
              fontSize: "16px",
              padding: "0.9rem 1.8rem",
              borderRadius: "1rem",
              boxShadow:
                "0 0 14px rgba(173,255,83,0.4), inset 0 -3px 8px rgba(0,0,0,0.25)",
              letterSpacing: "0.5px",
              display: "inline-block",
            }}
          >
            Перейти к поиску растений
          </Link>
        </div>
      </div>
    </main>
  );
}
