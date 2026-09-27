import type {
  AlunoResumoType,
  EventoImportacaoType,
  LogImportacaoType,
} from '@/data/types/services';
import { api } from './api';
import { endpoints } from './endpoints';

export const listarEventos = async (ano: number) => {
  const { data } = await api.get<EventoImportacaoType[]>(
    endpoints.importacao.eventos,
    { params: { ano } }
  );
  return data;
};

export const listarLogs = async () => {
  const { data } = await api.get<LogImportacaoType[]>(
    endpoints.importacao.logs
  );
  return data;
};

export const listarAlunosDoLog = async (logId: string) => {
  const { data } = await api.get<AlunoResumoType[]>(
    endpoints.importacao.alunos(logId)
  );
  return data;
};

export const importarInscritos = async (referencia: string) => {
  const { data } = await api.post<LogImportacaoType>(
    endpoints.importacao.inscritos,
    { referencia }
  );
  return data;
};
