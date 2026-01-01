import axiosInstance, { endpoints } from "../lib/axios";

export interface UserPayload {
  id?: string;
  name: string;
  email: string;
  senha?: string;
  role: 'professor' | 'student';
}

export async function getUsers(role: 'professor' | 'student') {
  const route = role === 'professor' ? '/teacher' : '/user'; 
  try {
    const res = await axiosInstance.get(route);
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar usuários", error);
    throw error;
  }
}

export async function createUser(data: UserPayload) {
  const endpoint = data.role === 'professor' ? '/auth/signup-professor' : '/auth/signup-student';
  const payload = {
    email: data.email,
    senha: data.senha,
    nome: data.name,
    materia: 'Geral',
    [data.role === 'professor' ? 'professorName' : 'studentName']: data.name
  };
  
  const res = await axiosInstance.post(endpoint, payload);
  return res.data;
}

export async function updateUser(id: string, data: Partial<UserPayload>) {
  const res = await axiosInstance.put(`${endpoints.user}/${id}`, data);
  return res.data;
}

export async function deleteUser(id: string) {
  const res = await axiosInstance.delete(`${endpoints.user}/${id}`);
  return res.data;
}