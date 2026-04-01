import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImg from "../assets/Forgot passsword.png";
import cadnaIcon from "../assets/cadna.png";

const responsiveStyles = `
  /* ── MOBILE  < 860px ── */
  .fp-desktop { display: flex; }
  .fp-mobile  { display: none; }

  @media (max-width: 859px) {
    .fp-desktop { display: none !important; }
    .fp-mobile  { display: flex !important; }
  }
`;



const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-8 left-8 text-white hover:text-gray-200 transition-colors bg-transparent border-0 cursor-pointer"
    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
  >
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  </button>
);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot password submitted:", email);
    navigate("/verify-code"); // Navigate to next step
  };

  return (
    <>
      <style>{responsiveStyles}</style>

      {/* ══════════════════════════════════════
          DESKTOP  ≥ 860px
      ══════════════════════════════════════ */}
      <div
        className="fp-desktop relative min-h-screen w-full"
        style={{
          backgroundImage: `url('${backgroundImg}')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          flexWrap: "nowrap",
        }}
      >
        <BackButton onClick={() => navigate("/signin")} />

        {/* ── LEFT — blue zone: lock icon ── */}
        <div
          className="flex flex-col items-center justify-center"
          style={{
            width: "40%",
            flexShrink: 0,    // ← ajoute ceci
          }}
        >
          <img src={cadnaIcon} alt="Lock" style={{ width: "clamp(160px, 22vw, 320px)", height: "auto", objectFit: "contain" }} />
        </div>

        {/* ── RIGHT — white zone: form ── */}
        <div
          className="flex flex-col justify-center"
          style={{
            width: "60%",        // ← était 55%
            flexShrink: 0,
            paddingLeft: "8%",   // ← augmente pour pousser dans la zone blanche
            paddingRight: "8%",
          }}
        >
          <div className="text-center mb-10" style={{ marginTop: "-60px" }}>
            <h2
              className="font-bold mb-3"
              style={{
                color: "#053B76",
                fontFamily: "'Segoe UI', sans-serif",
                fontSize: "2.9rem",   // ← était 2.3rem
                lineHeight: 1.2,
              }}
            >
              Forgot <span style={{ color: "#0B96D9" }}>P</span>assword
            </h2>
            <p
              className="text-sm"
              style={{ color: "#6B8DB2", fontFamily: "'Segoe UI', sans-serif", fontSize: "1rem" }}
            >
              Don't worry we got you
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8 items-center" style={{ width: "100%", maxWidth: "100%", margin: "0 auto" }}>
            <div className="w-full">
              <label
                style={{ display: "block", color: "#053B76", fontFamily: "'Segoe UI', sans-serif", fontWeight: "bold", fontSize: "0.95rem", marginBottom: "8px", marginLeft: "4px", textAlign: "left" }}
              >
                Email
              </label>
              <InputField
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
              />
            </div>

            <button
              type="submit"
              className="font-semibold tracking-wide transition-all duration-200 active:scale-95 text-white"
              style={{
                width: "100%",
                height: "56px",
                background: "#053B76",
                fontFamily: "'Segoe UI', sans-serif",
                fontSize: "1.05rem",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 4px 14px rgba(5, 59, 118, 0.3)",
                marginTop: "16px",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(5, 59, 118, 0.5)"; e.currentTarget.style.background = "#0a4d95"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(5, 59, 118, 0.3)"; e.currentTarget.style.background = "#053B76"; }}
            >
              Send the code
            </button>
          </form>

          <p
            className="text-center"
            style={{
              color: "#053B76",
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: "0.95rem",
              marginTop: "48px",
              fontWeight: "600",
            }}
          >
            <Link
              to="/signin"
              style={{ color: "#053B76", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0B96D9")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#053B76")}
            >
              Back to login ?
            </Link>
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MOBILE  < 860px  
      ══════════════════════════════════════ */}
      <div
        className="fp-mobile flex-col min-h-screen w-full relative"
        style={{
          background: "linear-gradient(170deg, #053B76 0%, #0B96D9 55%, #ceedf8 100%)",
        }}
      >
        <BackButton onClick={() => navigate("/signin")} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "12vh",
            paddingBottom: 32,
          }}
        >
          <img src={cadnaIcon} alt="Lock" style={{ width: "160px", height: "auto" }} />
        </div>

        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.98)",
            borderRadius: "40px 40px 0 0",
            padding: "40px 24px 44px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2
              style={{
                color: "#053B76",
                fontFamily: "'Segoe UI', sans-serif",
                fontWeight: 700,
                fontSize: "1.9rem",
                lineHeight: 1.2,
                marginBottom: 8,
              }}
            >
              Forgot <span style={{ color: "#0B96D9" }}>P</span>assword
            </h2>
            <p style={{ color: "#6B8DB2", fontFamily: "'Segoe UI', sans-serif", fontSize: "0.95rem" }}>
              Don't worry we got you
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 24, padding: "0 10px" }}
          >
            <div>
              <label
                style={{ display: "block", color: "#053B76", fontFamily: "'Segoe UI', sans-serif", fontWeight: "bold", fontSize: "0.95rem", marginBottom: "8px", marginLeft: "4px", textAlign: "left" }}
              >
                Email
              </label>
              <InputField
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                mobile
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                height: 56,
                background: "#053B76",
                color: "#FFFFFF",
                fontFamily: "'Segoe UI', sans-serif",
                fontWeight: 600,
                fontSize: "1.1rem",
                border: "none",
                borderRadius: 12,
                boxShadow: "0 4px 14px rgba(5,59,118,0.3)",
                cursor: "pointer",
                transition: "all 0.2s",
                marginTop: 12,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(5,59,118,0.5)"; e.currentTarget.style.background = "#0a4d95"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(5,59,118,0.3)"; e.currentTarget.style.background = "#053B76"; }}
            >
              Send the code
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: "0.95rem",
              marginTop: 48,
              fontWeight: 600,
            }}
          >
            <Link
              to="/signin"
              style={{ color: "#053B76", textDecoration: "none" }}
            >
              Back to login ?
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

function InputField({ type, name, value, onChange, placeholder, mobile }) {
  const [focused, setFocused] = useState(false);

  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full outline-none transition-all duration-200"
      style={{
        width: "100%",
        height: mobile ? 50 : 56,
        padding: "12px 16px",
        border: focused ? "2px solid #0B96D9" : "1.5px solid #053B76",
        borderRadius: 8,
        background: "#FFFFFF",
        color: "#053B76",
        fontFamily: "'Segoe UI', sans-serif",
        fontSize: "0.95rem",
        boxShadow: focused ? "0 0 0 3px rgba(11,150,217,0.13)" : "none",
        boxSizing: "border-box",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}
