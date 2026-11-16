import { FormProvider, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { toastError } from '@/lib/utils';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { CONFIGURACAO_PADRAO, useConfiguracao } from '@/hooks/useConfiguracao';
import { updateConfiguracao } from '@/services/configuracao';
import type { ConfiguracaoType } from '@/data/types/services';
import { ConfigFormView } from './ConfigFormView';

const mensagemQuantidade = 'A quantidade deve ficar entre 1 e 10';
const mensagemPontos = 'Os pontos devem ficar entre 1 e 3';

export const ConfigForm = () => {
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useConfiguracao();
  const methods = useForm<ConfiguracaoType>({
    defaultValues: CONFIGURACAO_PADRAO,
  });

  useEffect(() => {
    if (data) methods.reset(data);
  }, [data, methods]);

  const { mutate, isPending: isSaving } = useMutation({
    mutationFn: updateConfiguracao,
    onSuccess: (saved) => {
      queryClient.setQueryData(queryClientKeys.configKeys.all, saved);
      toast.add({ type: 'success', title: 'Configurações salvas' });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível salvar as configurações');
    },
  });

  const onSubmit = methods.handleSubmit((values) => {
    const quantidade = Number(values.quantidadeQuestoesPadrao);
    const pontos = Number(values.pontosQuestaoPadrao);
    let invalid = false;

    if (quantidade < 1 || quantidade > 10) {
      methods.setError('quantidadeQuestoesPadrao', {
        message: mensagemQuantidade,
      });
      invalid = true;
    }
    if (pontos < 1 || pontos > 3) {
      methods.setError('pontosQuestaoPadrao', { message: mensagemPontos });
      invalid = true;
    }
    if (invalid) return;

    mutate({
      ...values,
      quantidadeQuestoesPadrao: quantidade,
      pontosQuestaoPadrao: pontos,
    });
  });

  if (isError && !data) {
    return (
      <p className="mt-6 text-sm text-zinc-500">
        Não foi possível carregar as configurações.
      </p>
    );
  }

  return (
    <FormProvider {...methods}>
      <ConfigFormView
        onSubmit={onSubmit}
        isLoading={isPending}
        isSaving={isSaving}
      />
    </FormProvider>
  );
};
