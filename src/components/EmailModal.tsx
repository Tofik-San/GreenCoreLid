"use client";

export default function EmailModal({
  plan,
  onClose,
}: {
  plan: string | null;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(255, 0, 0, 0.35)",
        zIndex: 999999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#000",
          color: "#0f0",
          padding: "32px",
          width: "420px",
          margin: "120px auto",
          textAlign: "center",
          fontSize: "18px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        TEST MODAL
        <br />
        <br />
        PLAN: {plan ?? "—"}
        <br />
        <br />
        Клик вне — закрыть
      </div>
    </div>
  );
}
