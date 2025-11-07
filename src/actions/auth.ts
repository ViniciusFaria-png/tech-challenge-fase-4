// src/actions/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { endpoints } from "../lib/axios";

export async function signUp(data: {
  email: string;
  senha: string;
  professorName?: string;
}) {
  console.log("📝 SignUp - Enviando dados:", data);
  const res = await axiosInstance.post(endpoints.user, data);
  console.log("✅ SignUp - Resposta:", res.data);
  return res.data;
}

export async function signIn(data: { email: string; senha: string }) {
  console.log("🔐 SignIn - Enviando dados:", {
    email: data.email,
    senha: "***",
  });

  const res = await axiosInstance.post(`${endpoints.user}/signin`, data);

  console.log("SignIn - Resposta completa:", res);
  console.log("SignIn - res.data:", res.data);
  console.log("SignIn - Token recebido:", res.data.token);
  console.log("SignIn - User recebido:", res.data.user);

  // ✅ Armazena token no AsyncStorage
  if (res.data.token) {
    await AsyncStorage.setItem("token", res.data.token);
    console.log("💾 Token salvo com sucesso no AsyncStorage");
  } else {
    console.error("❌ Token não veio na resposta!");
  }

  // Se houver dados do usuário, salva também
  if (res.data.user) {
    await AsyncStorage.setItem("userData", JSON.stringify(res.data.user));
  }

  return res.data;
}

export async function getCurrentUser() {
  console.log("👤 Buscando usuário atual...");
  const res = await axiosInstance.get(`${endpoints.user}/me`);
  console.log("getCurrentUser - Resposta:", res.data);
  return res.data;
}

export async function validateToken() {
  console.log("🔎 Validando token...");
  try {
    const res = await axiosInstance.get(`${endpoints.user}/me`);
    console.log("✅ Token válido - Resposta:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Token inválido:", error);
    await AsyncStorage.multiRemove(["token", "userData"]);
    throw error;
  }
}
