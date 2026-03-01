type Props = { onBack?: () => void };

export default function Terms({ onBack }: { onBack?: () => void }) {
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

      <h1 style={{ fontSize: 32, marginTop: 20 }}>Terms of Service</h1>

      <p style={{ fontSize: 18, marginTop: 16, maxWidth: 900, lineHeight: 1.6 }}>
        If you can read this sentence, the Terms page is rendering correctly.
        By using TechTales Labs, you agree to these terms. Premium access depends on payment status via Stripe.
        Contact: TechTaleslabs@gmail.com
      </p>
    </div>
  );
}
