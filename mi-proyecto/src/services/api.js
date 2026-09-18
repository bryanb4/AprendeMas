// src/services/api.js
// Cliente real del backend Express (antes eran mocks en memoria)

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

async function handleRes(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Error en el servidor");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function apiRegister(userData) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleRes(res);
}

export async function apiLogin(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleRes(res);
}

export async function apiVerifyEmail(token) {
  const res = await fetch(`${API_URL}/api/auth/verify?token=${encodeURIComponent(token)}`);
  return handleRes(res);
}

export async function apiResendVerification(email) {
  const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleRes(res);
}

export async function apiGetProfile(token) {
  const res = await fetch(`${API_URL}/api/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleRes(res);
}

export async function apiUpdateProfile(token, data) {
  const res = await fetch(`${API_URL}/api/auth/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return handleRes(res);
}

export async function apiChangePassword(token, passwordActual, passwordNueva) {
  const res = await fetch(`${API_URL}/api/auth/profile/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ passwordActual, passwordNueva }),
  });
  return handleRes(res);
}

// Compatibilidad: HomePage y RegisterPage importaban mockLogin/mockRegister.
// Ahora apuntan al backend real.
export const mockLogin = (email, password) => apiLogin(email, password);

// RegisterPage actual llama mockRegister(userData, password).
// Aceptamos ambas firmas: objeto completo o (email, password).
export const mockRegister = (userDataOrEmail, password) => {
  if (typeof userDataOrEmail === "object") {
    const data = { ...userDataOrEmail };
    if (password && !data.password) data.password = password;
    return apiRegister(data);
  }
  return apiRegister({ email: userDataOrEmail, password });
};

export { API_URL };
