import { useEffect, useState } from "react";
import { getTeacher } from "../actions/teacher";
import type { ITeacher } from "../types/teacher";

export const useProfessorName = (professorId: string) => {
  const [professorName, setProfessorName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!professorId) {
      setProfessorName("Autor desconhecido");
      setIsLoading(false);
      return;
    }

    const fetchProfessorName = async () => {
      setIsLoading(true);
      try {
        const teacher: ITeacher = await getTeacher(professorId);
        setProfessorName(teacher?.nome || "Autor desconhecido");
      } catch (error) {
        console.error("Erro ao buscar dados do professor:", error);
        setProfessorName("Autor desconhecido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessorName();
  }, [professorId]);

  return { professorName, isLoading };
};
