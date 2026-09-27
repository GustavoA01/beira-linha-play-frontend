import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/toast';
import {
  importacaoSchema,
  type ImportacaoFormType,
} from '@/data/schemas/importacao';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { toastError } from '@/lib/utils';
import {
  importarInscritos,
  listarEventos,
  listarLogs,
} from '@/services/importacao';

const anoAtual = new Date().getFullYear();

export const useImportacao = () => {
  const queryClient = useQueryClient();
  const [logAberto, setLogAberto] = useState<string | null>(null);
  const methods = useForm<ImportacaoFormType>({
    resolver: zodResolver(importacaoSchema),
    defaultValues: { ano: anoAtual, referencia: '' },
  });
  const ano = methods.watch('ano');
  const eventos = useQuery({
    queryKey: ['importacao', 'eventos', ano],
    queryFn: () => listarEventos(ano),
  });
  const logs = useQuery({
    queryKey: ['importacao', 'logs'],
    queryFn: listarLogs,
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: importarInscritos,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['importacao', 'logs'] });
      void queryClient.invalidateQueries({
        queryKey: queryClientKeys.courseKeys.all,
      });
      toast.add({
        type: 'success',
        title: 'Participantes importados',
      });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível importar os participantes');
    },
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    await mutateAsync(data.referencia);
  });

  const logSelecionado = logs.data?.find((log) => log.id === logAberto) ?? null;

  return {
    register: methods.register,
    errors: methods.formState.errors,
    isSubmitting: methods.formState.isSubmitting || isPending,
    onSubmit,
    ano,
    anoAtual,
    anos: Array.from({ length: 2 }, (_, indice) => anoAtual - indice),
    eventos: eventos.data ?? [],
    eventosPendentes: eventos.isPending,
    eventosComErro: eventos.isError,
    logs: logs.data ?? [],
    logsPendentes: logs.isPending,
    logsComErro: logs.isError,
    logAberto,
    nomeLogAberto: logSelecionado?.nomeEvento ?? '',
    abrirLog: setLogAberto,
    trocarAno: (proximo: number) => {
      methods.setValue('ano', proximo);
      methods.setValue('referencia', '');
    },
  };
};
