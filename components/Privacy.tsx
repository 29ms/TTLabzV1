export default function Privacy({ onBack }: { onBack?: () => void }) {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: 24 }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{ padding: "10px 14px", border: "1px solid #444", background: "transparent", color: "#fff" }}
        >
          ← Back
        </button>
      )}

      <h1 style={{ fontSize: 32, marginTop: 20 }}>Privacy Policy</h1>

      <p style={{ fontSize: 18, marginTop: 16, maxWidth: 900, lineHeight: 1.6 }}>
        If you can read this sentence, the Privacy page is rendering correctly.
        TechTales Labs collects account email info via Firebase Authentication, and uses Stripe for payments.
        We do not store your full card details. Contact: techtaleslabs@gmail.com
      </p>
    </div>
  );
}
