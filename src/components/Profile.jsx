import React, { useState, useRef } from 'react';
import { useUser } from '../context/UserContext';

const responsiveStyles = `
  .profile-card {
    flex-direction: row;
    padding: 60px 80px;
    gap: 80px;
    align-items: center;
  }
  .profile-form { max-width: 620px; }
  .profile-fields-row { flex-direction: row; gap: 28px; }
  .profile-field { flex: 1; }

  /* iPad */
  @media (max-width: 1024px) and (min-width: 768px) {
    .profile-card { padding: 48px 48px; gap: 48px; }
    .profile-avatar-size { width: 200px !important; height: 200px !important; font-size: 60px !important; }
  }

  /* Mobile */
  @media (max-width: 767px) {
    .profile-card { flex-direction: column !important; padding: 32px 24px !important; gap: 32px !important; align-items: stretch !important; }
    .profile-left { align-items: center; }
    .profile-fields-row { flex-direction: column !important; gap: 20px !important; }
    .profile-form { max-width: 100% !important; }
    .profile-avatar-size { width: 160px !important; height: 160px !important; font-size: 50px !important; }
    .profile-save-btn { width: 100% !important; }
  }
`;

function AvatarDisplay({ user, initials }) {
  if (user.avatar) {
    return (
      <img src={user.avatar} alt={initials} className="profile-avatar-size" style={{
        width: 260, height: 260, borderRadius: '50%', objectFit: 'cover',
        border: '8px solid #ceedf8', boxShadow: '0 4px 24px rgba(5,59,118,0.15)',
      }} />
    );
  }
  return (
    <div className="profile-avatar-size" style={{
      width: 260, height: 260, borderRadius: '50%',
      background: 'linear-gradient(135deg, #053B76, #0B96D9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: 80,
      border: '8px solid #ceedf8', boxShadow: '0 4px 24px rgba(5,59,118,0.15)',
      flexShrink: 0,
    }}>{initials}</div>
  );
}

export default function Profile() {
  const { user, updateUser, uploadAvatar, removeAvatar, initials, displayName } = useUser();

  const [form, setForm] = useState({
    firstName: user.firstName, lastName: user.lastName,
    email: user.email, password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange      = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleFileChange  = (e) => { const f = e.target.files?.[0]; if (f) uploadAvatar(f); };
  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ firstName: form.firstName, lastName: form.lastName, email: form.email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputStyle = {
    width: '100%', height: 68, borderRadius: 16,
    border: '2px solid #0B96D9', padding: '0 20px',
    fontWeight: 600, color: '#053B76', fontSize: '1.05rem',
    outline: 'none', boxSizing: 'border-box', background: '#fff',
  };
  const labelStyle = { display: 'block', color: '#053B76', fontWeight: 700, marginBottom: 10, fontSize: '1rem' };

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={{ flex: 1, display: 'flex', width: '100%', minHeight: '100%' }}>
        <div className="profile-card" style={{
          flex: 1, background: '#fff', borderRadius: 32,
          border: '4px solid #ceedf8', boxShadow: '0 2px 16px rgba(5,59,118,0.07)',
          display: 'flex',
        }}>

          {/* LEFT */}
          <div className="profile-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <AvatarDisplay user={user} initials={initials} />
              <button type="button" onClick={handleAvatarClick} style={{
                position: 'absolute', bottom: 12, right: 12,
                background: '#053B76', color: '#fff', border: '4px solid #fff',
                borderRadius: '50%', width: 48, height: 48,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 2px 10px rgba(5,59,118,0.3)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
            </div>
            <h2 style={{ color: '#053B76', fontWeight: 800, fontSize: '1.8rem', margin: 0, textAlign: 'center' }}>{displayName}</h2>
            {user.avatar && (
              <button type="button" onClick={removeAvatar} style={{ background: 'none', border: 'none', color: '#e05252', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}>
                Remove photo
              </button>
            )}
          </div>

          {/* RIGHT */}
          <form className="profile-form" onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 40 }}>

            <div className="profile-fields-row" style={{ display: 'flex' }}>
              <div className="profile-field">
                <label style={labelStyle}>First Name</label>
                <input name="firstName" type="text" value={form.firstName} onChange={handleChange} style={inputStyle} />
              </div>
              <div className="profile-field">
                <label style={labelStyle}>Last Name</label>
                <input name="lastName" type="text" value={form.lastName} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            <div className="profile-fields-row" style={{ display: 'flex' }}>
              <div className="profile-field">
                <label style={labelStyle}>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle} />
              </div>
              <div className="profile-field" style={{ position: 'relative' }}>
                <label style={labelStyle}>New Password</label>
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange}
                  placeholder="Leave blank to keep current" style={{ ...inputStyle, paddingRight: 56 }} />
                <button type="button" onClick={() => setShowPassword(s => !s)} tabIndex={-1}
                  style={{ position: 'absolute', right: 16, bottom: 22, background: 'none', border: 'none', cursor: 'pointer', color: '#0B96D9', display: 'flex', alignItems: 'center' }}>
                  {showPassword
                    ? <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M3 3l18 18"/></svg>
                    : <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  }
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
              <button type="submit" className="profile-save-btn" style={{
                width: 320, height: 64, background: saved ? '#0FE2A6' : '#053B76',
                color: '#fff', fontWeight: 700, fontSize: '1.15rem',
                border: 'none', borderRadius: 16, cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(5,59,118,0.2)', transition: 'background 0.3s',
              }}>
                {saved ? '✓  Saved!' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}