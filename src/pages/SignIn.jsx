import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImg from "../assets/Sign In _WEB.svg";
import logo from "../assets/Logo_V2.svg";
import { apiFetch } from "../api";

const responsiveStyles = `
  .signin-desktop { display: flex; }
  .signin-mobile  { display: none; }
  @media (max-width: 859px) {
    .signin-desktop { display: none !important; }
    .signin-mobile  { display: flex !important; }
  }
`;

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      navigate("/dashboard/exam-config");
    } catch (err) {
      setError(err?.detail?.[0]?.msg || err?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{responsiveStyles}</style>

      {/* ══ DESKTOP ══ */}
      <div className="signin-desktop min-h-screen w-full" style={{ backgroundImage: `url('${backgroundImg}')`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}>

        {/* LEFT — form */}
        <div className="flex flex-col justify-center" style={{ width: "58%", paddingLeft: "5%", paddingRight: "5%" }}>
          <div className="text-center mb-10">
            <h2 className="font-bold mb-3" style={{ color: "#053B76", fontFamily: "'Segoe UI', sans-serif", fontSize: "2.1rem", lineHeight: 1.2 }}>
              Welcome Back to <span style={{ color: "#0B96D9", fontSize: "40px" }}>Q</span>uizor
            </h2>
            <p className="text-sm border-0" style={{ color: "#6B8DB2", fontFamily: "'Segoe UI', sans-serif", fontSize: "0.95rem" }}>
              Sign in to manage and evaluate exams.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <InputField type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email"
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#053B76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>}
            />

            <div className="relative">
              <InputField type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Password" extraPaddingRight
                icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#053B76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path><circle cx="12" cy="16" r="1.5" fill="#053B76" strokeWidth="1" stroke="#053B76"></circle><circle cx="8" cy="16" r="1.5" fill="#053B76" strokeWidth="1" stroke="#053B76"></circle><circle cx="16" cy="16" r="1.5" fill="#053B76" strokeWidth="1" stroke="#053B76"></circle></svg>}
              />
              <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
            </div>

            <div className="flex justify-between items-center text-sm px-1 pt-1" style={{ fontFamily: "'Segoe UI', sans-serif", color: "#053B76", fontWeight: "600" }}>
              <label className="flex items-center gap-2 cursor-pointer border-0">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 cursor-pointer" style={{ accentColor: "#053B76", borderRadius: "4px" }} />
                Remember me
              </label>
              <Link to="/forgot-password" className="hover:text-[#0B96D9] transition-colors border-0">Forgot password ?</Link>
            </div>

            {error && <p style={{ color: "#e53e3e", textAlign: "center", fontSize: "0.9rem", fontWeight: 600 }}>{error}</p>}

            <div className="flex justify-center mt-6 border-0">
              <button type="submit" disabled={loading}
                className="font-semibold text-sm tracking-wide transition-all duration-200 active:scale-95"
                style={{ width: "50%", height: "55px", background: "#FFFFFF", color: "#053B76", fontFamily: "'Segoe UI', sans-serif", fontSize: "1.2rem", fontWeight: "700", border: "1.5px solid #053B76", borderRadius: "16px", boxShadow: "0 4px 18px rgba(114, 207, 249, 0.25)", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(114, 207, 249, 0.5)"; e.currentTarget.style.background = "#f4faff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 18px rgba(114, 207, 249, 0.25)"; e.currentTarget.style.background = "#FFFFFF"; }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <p className="text-center border-0" style={{ color: "#6B8DB2", fontFamily: "'Segoe UI', sans-serif", fontSize: "0.95rem", marginTop: "32px" }}>
            Don't have an account ?{" "}
            <Link to="/signup" className="font-bold border-0" style={{ color: "#053B76" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0B96D9")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#053B76")}>
              Sign Up
            </Link>
          </p>
        </div>

        {/* RIGHT — logo */}
        <div className="flex flex-col items-center justify-center border-0" style={{ width: "42%", paddingRight: "10%", paddingLeft: "20%" }}>
          <div className="rounded-full bg-white flex items-center justify-center shadow-xl border-0" style={{ width: "clamp(200px, 26vw, 420px)", height: "clamp(200px, 26vw, 420px)", marginLeft: "10%" }}>
            <img src={logo} alt="QuiZor Logo" className="object-contain" style={{ width: "clamp(115px, 18vw, 230px)", height: "clamp(115px, 18vw, 230px)" }} />
          </div>
        </div>
      </div>

      {/* ══ MOBILE ══ */}
      <div className="signin-mobile flex-col min-h-screen w-full border-0" style={{ background: "linear-gradient(170deg, #053B76 0%, #0B96D9 55%, #ceedf8 100%)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "12vh", paddingBottom: 32 }}>
          <div style={{ width: 180, height: 180, borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 40px rgba(5,59,118,0.25)" }}>
            <img src={logo} alt="QuiZor Logo" style={{ width: 148, height: 148, objectFit: "contain" }} />
          </div>
        </div>

        <div style={{ flex: 1, background: "rgba(255,255,255,0.97)", borderRadius: "40px 40px 0 0", padding: "36px 24px 44px", display: "flex", flexDirection: "column" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ color: "#053B76", fontFamily: "'Segoe UI', sans-serif", fontWeight: 700, fontSize: "1.7rem", lineHeight: 1.2, marginBottom: 8 }}>
              Welcome Back to <span style={{ color: "#0B96D9", fontSize: "1.9rem" }}>Q</span>uizor
            </h2>
            <p style={{ color: "#6B8DB2", fontFamily: "'Segoe UI', sans-serif", fontSize: "0.85rem" }}>Sign in to manage and evaluate exams.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <InputField type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" mobile
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#053B76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>}
            />

            <div style={{ position: "relative" }}>
              <InputField type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Password" extraPaddingRight mobile
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#053B76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path><circle cx="12" cy="16" r="1" fill="#053B76" strokeWidth="1" stroke="#053B76"></circle><circle cx="8" cy="16" r="1" fill="#053B76" strokeWidth="1" stroke="#053B76"></circle><circle cx="16" cy="16" r="1" fill="#053B76" strokeWidth="1" stroke="#053B76"></circle></svg>}
              />
              <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
            </div>

            <div className="flex justify-between items-center text-sm px-1 pt-0" style={{ fontFamily: "'Segoe UI', sans-serif", color: "#053B76", fontWeight: "600" }}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 cursor-pointer" style={{ accentColor: "#053B76" }} />
                Remember me
              </label>
              <Link to="/forgot-password" className="hover:text-[#0B96D9]">Forgot password ?</Link>
            </div>

            {error && <p style={{ color: "#e53e3e", textAlign: "center", fontSize: "0.9rem", fontWeight: 600 }}>{error}</p>}

            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
              <button type="submit" disabled={loading}
                style={{ width: "55%", height: 52, background: "#FFFFFF", color: "#053B76", fontFamily: "'Segoe UI', sans-serif", fontWeight: 700, fontSize: "1.1rem", border: "1.5px solid #053B76", borderRadius: 26, boxShadow: "0 4px 18px rgba(114,207,249,0.25)", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(114,207,249,0.5)"; e.currentTarget.style.background = "#f4faff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 18px rgba(114,207,249,0.25)"; e.currentTarget.style.background = "#FFFFFF"; }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <p style={{ textAlign: "center", color: "#6B8DB2", fontFamily: "'Segoe UI', sans-serif", fontSize: "0.95rem", marginTop: 36 }}>
            Don't have an account ?{" "}
            <Link to="/signup" style={{ color: "#053B76", fontWeight: 700, textDecoration: "none" }}>Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}

function EyeToggle({ show, onToggle }) {
  return (
    <button type="button" onClick={onToggle} tabIndex={-1} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#053B76", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
      {show ? (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
      ) : (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
      )}
    </button>
  );
}

function InputField({ type, name, value, onChange, placeholder, extraPaddingRight, mobile, icon }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%" }}>
      {icon && (
        <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          {icon}
        </div>
      )}
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required
        className={mobile ? "" : "w-full text-sm outline-none transition-all duration-200"}
        style={{ width: "100%", height: mobile ? 50 : 54, paddingLeft: icon ? 48 : 16, paddingRight: extraPaddingRight ? 48 : 16, border: focused ? "2px solid #0B96D9" : "1px solid #053B76", borderRadius: 12, background: "#FFFFFF", color: "#053B76", fontFamily: "'Segoe UI', sans-serif", fontSize: mobile ? "0.95rem" : "1rem", outline: "none", boxShadow: focused ? "0 0 0 3px rgba(11,150,217,0.13)" : "none", transition: "all 0.2s", boxSizing: "border-box" }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      />
    </div>
  );
}