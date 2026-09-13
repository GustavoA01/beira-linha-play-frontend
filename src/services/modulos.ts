import { api } from './api';
import type { ModuloResponse, SalvarModuloPayload } from './types';

export const criarModulo = async (
  cursoId: string,
  payload: SalvarModuloPayload
) => {
  const { data } = await api.post<ModuloResponse>(
    `/api/cursos/${cursoId}/modulos`,
    payload
  );
  return data;
};

export const buscarModulo = async (id: string) => {
  const { data } = await api.get<ModuloResponse>(`/api/modulos/${id}`);
  return data;
};

export const atualizarModulo = async (
  id: string,
  payload: SalvarModuloPayload
) => {
  const { data } = await api.patch<ModuloResponse>(
    `/api/modulos/${id}`,
    payload
  );
  return data;
};

export const excluirModulo = async (id: string) => {
  await api.delete(`/api/modulos/${id}`);
};
