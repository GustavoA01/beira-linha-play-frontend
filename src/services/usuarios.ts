import { api } from './api';
import { toUsuario } from './auth';
import type {
  AtualizarContaPayload,
  CriarAdminPayload,
  UsuarioResponse,
} from './types';

export const atualizarConta = async (payload: AtualizarContaPayload) => {
  const { data } = await api.patch<UsuarioResponse>(
    '/api/usuarios/me',
    payload
  );
  return toUsuario(data);
};

export const criarAdmin = async (payload: CriarAdminPayload) => {
  const { data } = await api.post<UsuarioResponse>('/api/admins', payload);
  return toUsuario(data);
};

export const listarMonitores = async () => {
  const { data } = await api.get<UsuarioResponse[]>('/api/monitores');
  return data.map(toUsuario);
};
