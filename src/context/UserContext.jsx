import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    avatar: null,
  });

  useEffect(() => {
    apiFetch("/api/v1/auth/me")
      .then((data) => {
        setUser((u) => ({
          ...u,
          firstName: data.first_name ?? "",
          lastName: data.last_name ?? "",
          email: data.email ?? "",
        }));
      })
      .catch(() => {});
  }, []);

  const updateUser = (fields) => setUser((u) => ({ ...u, ...fields }));
  const uploadAvatar = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => updateUser({ avatar: e.target.result });
    reader.readAsDataURL(file);
  };
  const removeAvatar = () => updateUser({ avatar: null });

  const initials = [user.firstName, user.lastName]
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join("");
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        uploadAvatar,
        removeAvatar,
        initials,
        displayName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
