import { api } from './api';
import type {
  CursoResponse,
  InscreverCursoPayload,
  SalvarCursoPayload,
} from './types';

export const listarCursos = async () => {
  const { data } = await api.get<CursoResponse[]>('/api/cursos');
  return data;
};

export const buscarCurso = async (id: string) => {
  const { data } = await api.get<CursoResponse>(`/api/cursos/${id}`);
  return data;
};

export const criarCurso = async (payload: SalvarCursoPayload) => {
  const { data } = await api.post<CursoResponse>('/api/cursos', payload);
  return data;
};

export const atualizarCurso = async (
  id: string,
  payload: SalvarCursoPayload
) => {
  const { data } = await api.patch<CursoResponse>(`/api/cursos/${id}`, payload);
  return data;
};

export const excluirCurso = async (id: string) => {
  await api.delete(`/api/cursos/${id}`);
};

export const inscreverCurso = async (
  id: string,
  payload: InscreverCursoPayload
) => {
  const { data } = await api.post<CursoResponse>(
    `/api/cursos/${id}/inscrever`,
    payload
  );
  return data;
};
