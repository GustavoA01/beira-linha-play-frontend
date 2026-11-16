import { useQuery } from '@tanstack/react-query';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { getConfiguracao } from '@/services/configuracao';
import type { ConfiguracaoType } from '@/data/types/services';

export const CONFIGURACAO_PADRAO: ConfiguracaoType = {
  quantidadeQuestoesPadrao: 1,
  quantidadeQuestoesTravada: false,
  pontosQuestaoPadrao: 1,
  pontosQuestaoTravados: false,
};

export const useConfiguracao = () =>
  useQuery({
    queryKey: queryClientKeys.configKeys.all,
    queryFn: getConfiguracao,
  });
