import axiosInstance from "../lib/axios";

export interface UserPayload {
  id?: string;
  userId?: string;
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
    const teacherRes = await axiosInstance.get(`/teacher/${id}`);
    const teacherData = teacherRes.data;
    const teacher = teacherData.professor || teacherData.data || teacherData;
    
    // Buscar dados do user associado
    if (teacher.user_id) {
      try {
        const userRes = await axiosInstance.get(`/user/${teacher.user_id}`);
        const userData = userRes.data;
        const user = userData.user || userData.data || userData;
        
        return {
          ...teacher,
          userId: teacher.user_id,
          email: user.email || '',
        };
      } catch (e) {
        return { ...teacher, userId: teacher.user_id };
      }
    }
    
    return teacher;
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
  }
  
  console.log("Enviando payload para:", endpoint, payload); 
  const res = await axiosInstance.post(endpoint, payload);
  return res.data;
}

export async function updateUser(id: string, data: Partial<UserPayload>) {
  if (data.role === 'professor') {
    // Atualizar dados do professor no /teacher
    const teacherPayload: any = {};
    if (data.name) teacherPayload.nome = data.name;
    if (data.materia) teacherPayload.materia = data.materia;
    
    const teacherRes = await axiosInstance.put(`/teacher/${id}`, teacherPayload);
    
    // Atualizar dados do user no /user se userId foi fornecido
    if (data.userId && (data.email || data.senha)) {
      const userPayload: any = {};
      if (data.email) userPayload.email = data.email;
      if (data.senha) userPayload.senha = data.senha;
      
      await axiosInstance.put(`/user/${data.userId}`, userPayload);
    }
    
    return teacherRes.data;
  } else {
    const payload: any = {};
    if (data.email) payload.email = data.email;
    if (data.senha) payload.senha = data.senha;
    
    const res = await axiosInstance.put(`/user/${id}`, payload);
    return res.data;
  }
}

export async function deleteUser(id: string, role?: 'professor' | 'student') {
  const endpoint = role === 'professor' ? `/teacher/${id}` : `/user/${id}`;
  const res = await axiosInstance.delete(endpoint);
  return res.data;
}