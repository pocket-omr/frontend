import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

// ── Default user — replace with your backend fetch later ──
const DEFAULT_USER = {
  firstName: "Mohammed",
  lastName:  "Amine",
  email:     "MohammedAmine@esi-sba.dz",
  password:  "",
  avatar:    null,   // null = show initials, string = base64 or URL
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(DEFAULT_USER);

  // Update any user fields
  const updateUser = (fields) => setUser(u => ({ ...u, ...fields }));

  // Upload avatar: receives a File object, converts to base64
  const uploadAvatar = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => updateUser({ avatar: e.target.result });
    reader.readAsDataURL(file);
  };

  // Remove avatar → fall back to initials
  const removeAvatar = () => updateUser({ avatar: null });

  // Derived: initials from firstName + lastName
  const initials = [user.firstName, user.lastName]
    .filter(Boolean)
    .map(n => n[0].toUpperCase())
    .join('');

  // Full display name
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ');

  return (
    <UserContext.Provider value={{ user, updateUser, uploadAvatar, removeAvatar, initials, displayName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}