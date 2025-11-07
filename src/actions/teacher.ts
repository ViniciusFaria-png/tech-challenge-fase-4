import axiosInstance, { endpoints } from "../lib/axios";

export async function getTeacher(id: string) {
  const res = await axiosInstance.get(`${endpoints.teacher}/${id}`);
  console.log("Resposta da API para getTeacher:", res.data.professor);
  return res.data.professor;
}
