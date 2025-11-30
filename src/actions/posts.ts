import axiosInstance, { endpoints } from "../lib/axios";

export async function getPosts() {
  const res = await axiosInstance.get(endpoints.posts);
  return res.data.posts;
}

export async function getPost(id: string) {
  const res = await axiosInstance.get(`${endpoints.posts}/${id}`);
  return res.data.post;
}

export async function createPost(post: {
  titulo: string;
  conteudo: string;
  resumo?: string;
  professor_id: number;
}) {
  const res = await axiosInstance.post(endpoints.posts, post);
  return res.data;
}

export async function updatePost(
  id: string,
  post: { titulo?: string; conteudo?: string; resumo?: string },
) {
  const res = await axiosInstance.put(`${endpoints.posts}/${id}`, post);
  return res.data;
}

export async function deletePost(id: string) {
  const res = await axiosInstance.delete(`${endpoints.posts}/${id}`);
  return res.data.message;
}

export async function searchPosts(query: string) {
  const res = await axiosInstance.get(`${endpoints.posts}/search`, {
    params: { query },
  });
  return res.data;
}
