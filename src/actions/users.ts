import axiosInstance, { endpoints } from "../lib/axios";

export interface UserPayload {
  id?: string;
  name: string;
  email: string;
  senha?: string;
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
  
  const allUsers = usersRes.data.users || [];
  const teachers = teachersRes.data.professors || teachersRes.data.teachers || [];
  
  const professorUserIds = new Set(
    teachers.map((t: any) => t.user_id)
  );
  
  return allUsers.filter((u: any) => !professorUserIds.has(u.id));
}

export async function getUserById(id: string, role: 'professor' | 'student') {
  if (role === 'professor') {
    const res = await axiosInstance.get(`/teacher/${id}`);
    return res.data;
  } else {
    const res = await axiosInstance.get(`${endpoints.user}/${id}`);
    return res.data;
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
  const endpoint = data.role === 'professor' ? `/teacher/${id}` : `${endpoints.user}/${id}`;
  const payload: any = {
    email: data.email,
    ...(data.senha ? { senha: data.senha } : {})
  };

  if (data.role === 'professor') {
    payload.nome = data.name;
    payload.materia = 'Geral';
  } else {
    payload.nome = data.name;
  }

  const res = await axiosInstance.put(endpoint, payload);
  return res.data;
}

export async function deleteUser(id: string, role?: 'professor' | 'student') {
  const endpoint = role === 'professor' ? `/teacher/${id}` : `${endpoints.user}/${id}`;
  const res = await axiosInstance.delete(endpoint);
  return res.data;
}