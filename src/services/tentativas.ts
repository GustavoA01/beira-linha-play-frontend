import { api } from './api';
import type {
  EnviarTentativaPayload,
  ResultadoTentativaResponse,
  TentativaResponse,
} from './types';

export const listarMinhasTentativas = async (atividadeId?: string) => {
  const { data } = await api.get<TentativaResponse[]>(
    '/api/alunos/me/tentativas',
    { params: atividadeId ? { atividadeId } : undefined }
  );
  return data;
};

export const enviarTentativa = async (
  atividadeId: string,
  payload: EnviarTentativaPayload
) => {
  const { data } = await api.post<ResultadoTentativaResponse>(
    `/api/atividades/${atividadeId}/tentativas`,
    payload
  );
  return data;
};
