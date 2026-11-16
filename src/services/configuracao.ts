import { api } from './api';
import { endpoints } from './endpoints';
import type {
  ConfiguracaoType,
  SaveConfiguracaoPayloadType,
} from '@/data/types/services';

export const getConfiguracao = async () => {
  const { data } = await api.get<ConfiguracaoType>(
    endpoints.configuracao.current
  );
  return data;
};

export const updateConfiguracao = async (
  payload: SaveConfiguracaoPayloadType
) => {
  const { data } = await api.put<ConfiguracaoType>(
    endpoints.configuracao.current,
    payload
  );
  return data;
};
