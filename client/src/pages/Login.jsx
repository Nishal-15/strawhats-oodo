import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const colors = {
  stone: "#f5f3ec",
  ink: "#221d17",
  inkMuted: "#6f6858",
  walnut: "#c2731e",
  walnutDark: "#9e46279e",
  sage: "#6f7d53",
  line: "#ddd6c4",
  card: "#fffdf9",
  white: "#ffffff",
  errorRed: "#a3402c",
};

const fonts = {
  display: "'Fraunces', ui-serif, Georgia, serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace",
};

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: colors.stone,
    fontFamily: fonts.body,
    color: colors.ink,
    padding: "6vw 5vw",
    boxSizing: "border-box",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: "26rem",
    background: colors.card,
    border: `1px solid ${colors.line}`,
    borderRadius: "4px",
    padding: "2.75rem 2.25rem",
    boxShadow: "0 30px 60px -35px rgba(34, 29, 23, 0.35)",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    boxSizing: "border-box",
  },
  cornerBase: {
    position: "absolute",
    width: "14px",
    height: "14px",
    borderColor: colors.walnut,
    borderStyle: "solid",
    opacity: 0.55,
  },
  cornerTopLeft: {
    top: "-7px",
    left: "-7px",
    borderWidth: "1.5px 0 0 1.5px",
  },
  cornerBottomRight: {
    bottom: "-7px",
    right: "-7px",
    borderWidth: "0 1.5px 1.5px 0",
  },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: "0.72rem",
    fontWeight: 500,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: colors.walnut,
    margin: "0 0 0.6rem",
  },
  heading: {
    fontFamily: fonts.display,
    fontWeight: 600,
    fontSize: "1.9rem",
    letterSpacing: "-0.01em",
    margin: "0 0 0.5rem",
    color: colors.ink,
  },
  muted: {
    color: colors.inkMuted,
    fontSize: "0.95rem",
    margin: 0,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    fontFamily: fonts.mono,
    fontSize: "0.72rem",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.inkMuted,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: "0.95rem",
    color: colors.ink,
    background: colors.white,
    border: `1px solid ${colors.line}`,
    borderRadius: "4px",
    padding: "0.75rem 0.9rem",
    outline: "none",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    boxSizing: "border-box",
  },
  inputFocused: {
    borderColor: colors.walnut,
    boxShadow: "0 0 0 3px rgba(194, 115, 30, 0.16)",
  },
  error: {
    fontFamily: fonts.mono,
    fontSize: "0.82rem",
    color: colors.errorRed,
    background: "rgba(163, 64, 44, 0.08)",
    border: "1px solid rgba(163, 64, 44, 0.25)",
    borderRadius: "4px",
    padding: "0.7rem 0.9rem",
    margin: 0,
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontFamily: fonts.body,
    fontWeight: 600,
    fontSize: "0.95rem",
    color: colors.white,
    background: colors.walnut,
    border: "none",
    borderRadius: "4px",
    padding: "0.9rem 1.5rem",
    cursor: "pointer",
    transition: "background 0.15s ease, transform 0.15s ease",
  },
  buttonHover: {
    background: colors.walnutDark,
    transform: "translateY(-1px)",
  },
  buttonDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
    transform: "none",
  },
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@shiverp.local");
  const [password, setPassword] = useState("ChangeMe123!");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [buttonHovered, setButtonHovered] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
      `}</style>

      <form style={styles.card} onSubmit={handleSubmit}>
        <span style={{ ...styles.cornerBase, ...styles.cornerTopLeft }} />
        <span style={{ ...styles.cornerBase, ...styles.cornerBottomRight }} />

        <div>
          <p style={styles.eyebrow}>Shiv Furniture Works</p>
          <h1 style={styles.heading}>Mini ERP</h1>
          <p style={styles.muted}>Demand to delivery, connected.</p>
        </div>

        <label style={styles.label}>
          Email
          <input
            style={{
              ...styles.input,
              ...(focusedField === "email" ? styles.inputFocused : {}),
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            type="email"
            required
          />
        </label>

        <label style={styles.label}>
          Password
          <input
            style={{
              ...styles.input,
              ...(focusedField === "password" ? styles.inputFocused : {}),
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            type="password"
            required
          />
        </label>

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={{
            ...styles.button,
            ...(buttonHovered ? styles.buttonHover : {}),
            ...(submitting ? styles.buttonDisabled : {}),
          }}
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
          disabled={submitting}
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}