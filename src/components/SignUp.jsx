import React, { useState } from "react";
import { Link } from "react-router-dom";
import backgroundImg from "../assets/Sign Up _WEB _Background.png";
import logo from "../assets/Logo_V2.svg";

const responsiveStyles = `
  /* ── MOBILE  < 860px ── */
  .signup-desktop { display: flex; }
  .signup-mobile  { display: none; }

  @media (max-width: 859px) {
    .signup-desktop { display: none !important; }
    .signup-mobile  { display: flex !important; }
  }
`;

export default function SignUp() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign up submitted:", form);
  };

  return (
    <>
      <style>{responsiveStyles}</style>

      {/* ══════════════════════════════════════
          DESKTOP  ≥ 860px  —  code original
      ══════════════════════════════════════ */}
      <div
        className="signup-desktop min-h-screen w-full"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "100% 100%",
          
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
        }}
      >
        {/* ── LEFT — blue zone: logo centered ── */}
        <div
          className="flex flex-col items-center justify-center"
          style={{ width: "45%" }}
        >
          <div className="flex flex-col items-center gap-4">
            {/* Logo circle */}
            <div
              className="rounded-full bg-white flex items-center justify-center shadow-xl"
              style={{ width: "clamp(150px, 26vw, 380px)", height: "clamp(150px, 26vw, 380px)" }}
            >
              <img
                src={logo}
                alt="QuiZor Logo"
                className="object-contain" style={{ width: "clamp(105px, 18vw, 268px)", height: "clamp(105px, 18vw, 268px)" }}
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT — white zone: form ── */}
        <div
          className="flex flex-col justify-center"
          style={{
            width: "50%",
            paddingLeft: "10%",
            paddingRight: "6%",
          }}
        >
          {/* Title */}
          <div className="text-center mb-24">
            <h2
              className="font-bold mb-4"
              style={{
                color: "#053B76",
                fontFamily: "'Segoe UI', sans-serif",
                fontSize: "2.1rem",
                lineHeight: 1.2,
              }}
            >
              Create Your{" "}
              <span style={{ color: "#0B96D9", fontSize: "48px" }}>Q</span>
              uizor Account
            </h2>
            <p
              className="text-sm"
              style={{
                color: "#6B8DB2",
                fontFamily: "'Segoe UI', sans-serif",
              }}
            >
              Start creating and evaluating QCM &amp; QCS exams.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <InputField type="text"  name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" />
            <InputField type="text"  name="lastName"  value={form.lastName}  onChange={handleChange} placeholder="Last Name" />
            <InputField type="text"  name="userName"  value={form.userName}  onChange={handleChange} placeholder="UserName" />
            <InputField type="email" name="email"     value={form.email}     onChange={handleChange} placeholder="Email" />

            {/* Password + eye toggle */}
            <div className="relative">
              <InputField
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                extraPaddingRight
              />
              <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
            </div>

            {/* Sign Up Button */}
            <div className="flex justify-center mt-1">
              <button
                type="submit"
                className="rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 active:scale-95"
                style={{
                  width: "50%",
                  height: "60px",
                  background: "#FFFFFF",
                  color: "#053B76",
                  fontFamily: "'Segoe UI', sans-serif",
                  letterSpacing: "0.06em",
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  border: "1px solid #053B76",
                  boxShadow: "0 4px 18px rgba(114, 207, 249, 0.45)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(114, 207, 249, 0.7)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 18px rgba(114, 207, 249, 0.45)"; }}
              >
                Sign up
              </button>
            </div>
          </form>

          {/* Sign In link */}
          <p
            className="text-center"
            style={{
              color: "#6B8DB2",
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: "0.9rem",
              marginTop: "28px",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-bold"
              style={{ color: "#053B76" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0B96D9")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#053B76")}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MOBILE  < 860px  —  gradient bg
          Logo grand en haut, form en bas
      ══════════════════════════════════════ */}
      <div
        className="signup-mobile flex-col min-h-screen w-full"
        style={{
          background: "linear-gradient(170deg, #053B76 0%, #0B96D9 55%, #ceedf8 100%)",
        }}
      >
        {/* Logo — grand, centré en haut */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 56,
            paddingBottom: 32,
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 40px rgba(5,59,118,0.25)",
            }}
          >
            <img
              src={logo}
              alt="QuiZor Logo"
              style={{ width: 148, height: 148, objectFit: "contain" }}
            />
          </div>
        </div>

        {/* White card — form */}
        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.97)",
            borderRadius: "30px 30px 0 0",
            padding: "32px 24px 44px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h2
              style={{
                color: "#053B76",
                fontFamily: "'Segoe UI', sans-serif",
                fontWeight: 700,
                fontSize: "1.55rem",
                lineHeight: 1.2,
                marginBottom: 8,
              }}
            >
              Create Your{" "}
              <span style={{ color: "#0B96D9", fontSize: "1.8rem" }}>Q</span>
              uizor Account
            </h2>
            <p style={{ color: "#6B8DB2", fontFamily: "'Segoe UI', sans-serif", fontSize: "0.82rem" }}>
              Start creating and evaluating QCM &amp; QCS exams.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <InputField type="text"  name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" mobile />
            <InputField type="text"  name="lastName"  value={form.lastName}  onChange={handleChange} placeholder="Last Name"  mobile />
            <InputField type="text"  name="userName"  value={form.userName}  onChange={handleChange} placeholder="UserName"   mobile />
            <InputField type="email" name="email"     value={form.email}     onChange={handleChange} placeholder="Email"      mobile />

            {/* Password + eye toggle */}
            <div style={{ position: "relative" }}>
              <InputField
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                extraPaddingRight
                mobile
              />
              <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
            </div>

            {/* Sign Up Button */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
              <button
                type="submit"
                style={{
                  width: "55%",
                  height: 54,
                  background: "#FFFFFF",
                  color: "#053B76",
                  fontFamily: "'Segoe UI', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  letterSpacing: "0.06em",
                  border: "1px solid #053B76",
                  borderRadius: 12,
                  boxShadow: "0 4px 18px rgba(114,207,249,0.45)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(114,207,249,0.75)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 18px rgba(114,207,249,0.45)"; }}
              >
                Sign up
              </button>
            </div>
          </form>

          {/* Sign In link */}
          <p
            style={{
              textAlign: "center",
              color: "#6B8DB2",
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: "0.85rem",
              marginTop: 22,
            }}
          >
            Already have an account?{" "}
            <a
              href="/signin"
              style={{ color: "#053B76", fontWeight: 700, textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0B96D9")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#053B76")}
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

/* ── Eye toggle button ── */
function EyeToggle({ show, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      tabIndex={-1}
      style={{
        position: "absolute",
        right: 12,
        top: "50%",
        transform: "translateY(-50%)",
        color: "#0B96D9",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      {show ? (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>
      ) : (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      )}
    </button>
  );
}

/* ── Reusable input ── */
function InputField({ type, name, value, onChange, placeholder, extraPaddingRight, mobile }) {
  const [focused, setFocused] = useState(false);

  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className={mobile ? "" : "w-full rounded-xl text-sm outline-none transition-all duration-200"}
      style={{
        width: "100%",
        height: mobile ? 52 : 60,
        padding: extraPaddingRight ? "12px 48px 12px 16px" : "12px 16px",
        border: focused ? "2px solid #0B96D9" : "2px solid #053B76",
        borderRadius: 12,
        background: "rgba(255,255,255,0.85)",
        color: "#053B76",
        fontFamily: "'Segoe UI', sans-serif",
        fontSize: mobile ? "0.9rem" : undefined,
        outline: "none",
        boxShadow: focused ? "0 0 0 3px rgba(11,150,217,0.13)" : "none",
        transition: "all 0.2s",
        boxSizing: "border-box",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}