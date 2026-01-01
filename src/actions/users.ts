import axiosInstance from "../lib/axios";

export interface UserPayload {
  id?: string;
  name?: string;
  email?: string;
  senha?: string;
  materia?: string;
  role: 'professor' | 'student';
}

export async function getUsers(role: 'professor' | 'student') {
  if (role === 'professor') {
    const res = await axiosInstance.get('/teacher'); 
    const data = res.data;
    return data.professors || data.teachers || data.data || data || [];
  }
  
  const [usersRes, teachersRes] = await Promise.all([
    axiosInstance.get('/user'),
    axiosInstance.get('/teacher')
  ]);
  
  const allUsers = usersRes.data.users || usersRes.data || [];
  const teachers = teachersRes.data.professors || teachersRes.data.teachers || [];
  
  const professorUserIds = new Set(teachers.map((t: any) => t.user_id));
  
  return allUsers.filter((u: any) => !professorUserIds.has(u.id));
}

export async function getUserById(id: string, role: 'professor' | 'student') {
  if (role === 'professor') {
    const res = await axiosInstance.get(`/teacher/${id}`);
    const data = res.data;
    return data.professor || data.data || data;
  } else {
    const res = await axiosInstance.get(`/user/${id}`);
    const data = res.data;
    return data.user || data.data || data;
  }
}

export async function createUser(data: UserPayload) {
  const endpoint = '/user'; 
  
  const payload: any = {
    email: data.email,
    senha: data.senha,
  };

  if (data.role === 'professor') {
    payload.professorName = data.name; 
    payload.materia = data.materia || 'Geral';
  } else {
    payload.name = data.name; 
  }
  
  console.log("Enviando payload para:", endpoint, payload); 
  const res = await axiosInstance.post(endpoint, payload);
  return res.data;
}

export async function updateUser(id: string, data: Partial<UserPayload>) {
  const endpoint = data.role === 'professor' ? `/teacher/${id}` : `/user/${id}`;
  const payload: any = {};

  if (data.role === 'professor') {
    if (data.name) payload.nome = data.name;
    if (data.materia) payload.materia = data.materia;
  } else {
    if (data.email) payload.email = data.email;
    if (data.senha) payload.senha = data.senha;
  }

  const res = await axiosInstance.put(endpoint, payload);
  return res.data;
}

export async function deleteUser(id: string, role?: 'professor' | 'student') {
  const endpoint = role === 'professor' ? `/teacher/${id}` : `/user/${id}`;
  const res = await axiosInstance.delete(endpoint);
  return res.data;
}