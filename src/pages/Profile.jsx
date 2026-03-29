import React, { useState, useRef } from 'react';
import { useUser } from '../context/UserContext';

const responsiveStyles = `
  .profile-fields-row { flex-direction: row; gap: 28px; }
  .profile-field { flex: 1; }

  @media (max-width: 1024px) and (min-width: 768px) {
    .profile-avatar-size { width: 180px !important; height: 180px !important; font-size: 56px !important; }
  }

  @media (max-width: 767px) {
    .profile-card { flex-direction: column !important; padding: 32px 24px !important; gap: 32px !important; }
    .profile-left { align-items: center !important; }
    .profile-fields-row { flex-direction: column !important; gap: 20px !important; }
    .profile-avatar-size { width: 140px !important; height: 140px !important; font-size: 44px !important; }
    .profile-save-btn { width: 100% !important; }
  }
`;

function AvatarDisplay({ user, initials }) {
  if (user.avatar) {
    return (
      <img src={user.avatar} alt={initials} className="profile-avatar-size" style={{
        width: 240, height: 240, borderRadius: '50%', objectFit: 'cover',
        border: '6px solid #ceedf8', boxShadow: '0 4px 24px rgba(5,59,118,0.15)',
      }} />
    );
  }
  return (
    <div className="profile-avatar-size" style={{
      width: 240, height: 240, borderRadius: '50%',
      background: 'linear-gradient(135deg, #053B76, #0B96D9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: 76,
      border: '6px solid #ceedf8', boxShadow: '0 4px 24px rgba(5,59,118,0.15)',
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
    width: '100%', height: 56, borderRadius: 12,
    border: '2px solid #0B96D9', padding: '0 18px',
    fontWeight: 600, color: '#053B76', fontSize: '1rem',
    outline: 'none', boxSizing: 'border-box', background: '#fff',
  };
  const labelStyle = {
    display: 'block', color: '#053B76', fontWeight: 700,
    marginBottom: 8, fontSize: '0.95rem',
  };

  return (
    <>
      <style>{responsiveStyles}</style>

      {/* Full-page wrapper */}
      <div style={{
        flex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        width: '100%', minHeight: '100%',
        padding: '32px 24px', boxSizing: 'border-box',
      }}>
        {/* Card stretches to fill all available space */}
        <div className="profile-card" style={{
          width: '100%', height: '100%',
          background: '#fff', borderRadius: 32,
          border: '4px solid #ceedf8',
          boxShadow: '0 2px 16px rgba(5,59,118,0.07)',
          display: 'flex', flexDirection: 'row',
          alignItems: 'center',
          padding: '48px 64px', gap: 64,
          boxSizing: 'border-box',
        }}>

          {/* LEFT — avatar column */}
          <div className="profile-left" style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 20, flexShrink: 0,
          }}>
            <div style={{ position: 'relative' }}>
              <AvatarDisplay user={user} initials={initials} />
              <button type="button" onClick={handleAvatarClick} style={{
                position: 'absolute', bottom: 8, right: 8,
                background: '#053B76', color: '#fff', border: '4px solid #fff',
                borderRadius: '50%', width: 42, height: 42,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 2px 10px rgba(5,59,118,0.3)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
            </div>

            <h2 style={{ color: '#053B76', fontWeight: 800, fontSize: '1.4rem', margin: 0, textAlign: 'center' }}>
              {displayName}
            </h2>

            {user.avatar && (
              <button type="button" onClick={removeAvatar} style={{
                background: 'none', border: 'none', color: '#e05252',
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline',
              }}>
                Remove photo
              </button>
            )}
          </div>

          {/* RIGHT — form fills remaining width */}
          <form onSubmit={handleSubmit} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            gap: 28, minWidth: 0,
          }}>

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
                <label style={labelStyle}>Password</label>
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={handleChange} placeholder="Leave blank to keep current"
                  style={{ ...inputStyle, paddingRight: 52 }} />
                <button type="button" onClick={() => setShowPassword(s => !s)} tabIndex={-1} style={{
                  position: 'absolute', right: 14, bottom: 16,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#0B96D9', display: 'flex', alignItems: 'center',
                }}>
                  {showPassword
                    ? <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M3 3l18 18"/></svg>
                    : <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  }
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
              <button type="submit" className="profile-save-btn" style={{
                width: 280, height: 58,
                background: saved ? '#0FE2A6' : '#053B76',
                color: '#fff', fontWeight: 700, fontSize: '1.1rem',
                border: 'none', borderRadius: 14, cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(5,59,118,0.2)',
                transition: 'background 0.3s',
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