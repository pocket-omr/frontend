import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import backgroundImg from "../assets/Forgot passsword.png";
import cadnaIcon from "../assets/cadna.png";

const responsiveStyles = `
  .vc-desktop { display: flex; }
  .vc-mobile  { display: none; }
  @media (max-width: 859px) {
    .vc-desktop { display: none !important; }
    .vc-mobile  { display: flex !important; }
  }
`;



const BackButton = ({ onClick }) => (
  <button onClick={onClick} className="absolute top-8 left-8 text-white hover:text-gray-200 transition-colors bg-transparent border-0 cursor-pointer" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
  </button>
);

export default function VerifyCode() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleInput = (e, index) => {
    const val = e.target.value;
    if (val.length > 1) return; // limit to 1 char
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);

    // auto focus next
    if (val && index < 3) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // auto focus prev on backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-input-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const codeStr = code.join("");
    if (codeStr.length < 4) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeStr }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Invalid code');
      }
      navigate("/reset-password", { state: { email, code: codeStr } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{responsiveStyles}</style>
      <div className="vc-desktop relative min-h-screen w-full" style={{ backgroundImage: `url('${backgroundImg}')`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center center", flexWrap: "nowrap", }}>
        <BackButton onClick={() => navigate(-1)} />
        <div
          className="flex flex-col items-center justify-center"
          style={{
            width: "40%",
            flexShrink: 0,
          }}
        >
          <img src={cadnaIcon} alt="Lock" style={{ width: "clamp(160px, 22vw, 320px)", height: "auto", objectFit: "contain" }} />
        </div>
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
            >Verify Your <span style={{ color: "#0B96D9" }}>C</span>ode</h2>
            <p className="text-sm" style={{ color: "#6B8DB2", fontFamily: "'Segoe UI', sans-serif", fontSize: "1rem" }}>Enter the verification code sent to your email</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 items-center" style={{ width: "100%", maxWidth: "100%", margin: "0 auto" }}>
            <div className="w-full text-center">
              <label style={{ display: "block", color: "#053B76", fontFamily: "'Segoe UI', sans-serif", fontWeight: "bold", fontSize: "1.05rem", marginBottom: "16px" }}>Enter Code</label>
              <div className="flex justify-center gap-5 mt-10">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-input-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="text-center font-bold outline-none transition-all duration-200"
                    style={{
                      width: "100px",
                      height: "100px",
                      fontSize: "1.5rem",
                      color: "#053B76",
                      border: "2px solid #053B76",
                      borderRadius: "12px",
                      background: "#FFF",
                      boxShadow: digit ? "0 0 0 3px rgba(11,150,217,0.13)" : "none",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#0B96D9"}
                    onBlur={(e) => e.target.style.borderColor = "#053B76"}
                  />
                ))}
              </div>
            </div>
            <button type="submit" className="font-semibold transition-all text-white" style={{ width: "100%", height: "56px", background: "#053B76", fontFamily: "'Segoe UI', sans-serif", fontSize: "1.05rem", border: "none", borderRadius: "12px", boxShadow: "0 4px 14px rgba(5, 59, 118, 0.3)", marginTop: "16px", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.background = "#0a4d95"} onMouseLeave={(e) => e.currentTarget.style.background = "#053B76"}>Confirm code</button>
          </form>
          <p className="text-center" style={{ color: "#053B76", fontFamily: "'Segoe UI', sans-serif", fontSize: "0.95rem", marginTop: "48px", fontWeight: "600" }}>
            <Link to="/signin" style={{ color: "#053B76", textDecoration: "none" }}>Back to login ?</Link>
          </p>
        </div>
      </div>

      {/* MOBILE */}
      <div className="vc-mobile flex-col min-h-screen w-full relative" style={{ background: "linear-gradient(170deg, #053B76 0%, #0B96D9 55%, #ceedf8 100%)" }}>
        <BackButton onClick={() => navigate(-1)} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "12vh", paddingBottom: 32 }}>
          <img src={cadnaIcon} alt="Lock" style={{ width: "160px", height: "auto" }} />
        </div>
        <div style={{ flex: 1, background: "rgba(255,255,255,0.98)", borderRadius: "40px 40px 0 0", padding: "40px 24px 44px", display: "flex", flexDirection: "column" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ color: "#053B76", fontFamily: "'Segoe UI', sans-serif", fontWeight: 700, fontSize: "1.9rem", lineHeight: 1.2, marginBottom: 8 }}>Verify Your <span style={{ color: "#0B96D9" }}>C</span>ode</h2>
            <p style={{ color: "#6B8DB2", fontFamily: "'Segoe UI', sans-serif", fontSize: "0.95rem" }}>Enter the verification code sent to your email</p>
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24, padding: "0 10px" }}>
            <div className="w-full text-center">
              <label style={{ display: "block", color: "#053B76", fontFamily: "'Segoe UI', sans-serif", fontWeight: "bold", fontSize: "1.05rem", marginBottom: "16px" }}>Enter Code</label>
              <div className="flex justify-center gap-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`mobile-code-input-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="text-center font-bold outline-none transition-all duration-200"
                    style={{ width: "55px", height: "55px", fontSize: "1.3rem", color: "#053B76", border: "2px solid #053B76", borderRadius: "10px", background: "#FFF" }}
                    onFocus={(e) => e.target.style.borderColor = "#0B96D9"}
                    onBlur={(e) => e.target.style.borderColor = "#053B76"}
                  />
                ))}
              </div>
            </div>
            <button type="submit" style={{ width: "100%", height: 56, background: "#053B76", color: "#FFFFFF", fontFamily: "'Segoe UI', sans-serif", fontWeight: 600, fontSize: "1.1rem", border: "none", borderRadius: 12, boxShadow: "0 4px 14px rgba(5,59,118,0.3)", cursor: "pointer", transition: "all 0.2s", marginTop: 12 }}>Confirm code</button>
          </form>
          <p style={{ textAlign: "center", fontFamily: "'Segoe UI', sans-serif", fontSize: "0.95rem", marginTop: 48, fontWeight: 600 }}>
            <Link to="/signin" style={{ color: "#053B76", textDecoration: "none" }}>Back to login ?</Link>
          </p>
        </div>
      </div>
    </>
  );
}
