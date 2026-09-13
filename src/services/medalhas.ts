import { api } from './api';
import type {
  MedalhaResponse,
  SalvarMedalhaPayload,
  UsuarioResponse,
} from './types';

export const listarMedalhas = async () => {
  const { data } = await api.get<MedalhaResponse[]>('/api/medalhas');
  return data;
};

export const criarMedalha = async (payload: SalvarMedalhaPayload) => {
  const { data } = await api.post<MedalhaResponse>('/api/medalhas', payload);
  return data;
};

export const excluirMedalha = async (id: string) => {
  await api.delete(`/api/medalhas/${id}`);
};

export const equiparMedalha = async (id: string) => {
  const { data } = await api.post<UsuarioResponse>(
    `/api/medalhas/${id}/equipar`
  );
  return data;
};
