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
      </div>
    </main>
  );
}
