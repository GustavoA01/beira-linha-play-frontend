import { api } from './api';
import type {
  AtividadeResponse,
  MonitoramentoResponse,
  SalvarAtividadePayload,
} from './types';

export const criarAtividade = async (
  moduloId: string,
  payload: SalvarAtividadePayload
) => {
  const { data } = await api.post<AtividadeResponse>(
    `/api/modulos/${moduloId}/atividades`,
    payload
  );
  return data;
};

export const buscarAtividade = async (id: string) => {
  const { data } = await api.get<AtividadeResponse>(`/api/atividades/${id}`);
  return data;
};

export const atualizarAtividade = async (
  id: string,
  payload: SalvarAtividadePayload
) => {
  const { data } = await api.patch<AtividadeResponse>(
    `/api/atividades/${id}`,
    payload
  );
  return data;
};

export const excluirAtividade = async (id: string) => {
  await api.delete(`/api/atividades/${id}`);
};

export const monitoramentoAtividade = async (id: string) => {
  const { data } = await api.get<MonitoramentoResponse>(
    `/api/atividades/${id}/monitoramento`
  );
  return data;
};
