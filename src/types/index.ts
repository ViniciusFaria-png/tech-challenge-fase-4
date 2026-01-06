export interface User {
  id: string;
  email: string;
  professorName?: string;
  isProfessor?: boolean;
  professorId?: number;
}

export interface IPost {
  id: string;
  titulo: string;
  conteudo: string;
  resumo?: string;
  professor_id: string;
  created_at: string;
  updated_at: string;
}

export interface ITeacher {
  id: number;
  nome: string;
  materia: string;
  user_id: number;
}