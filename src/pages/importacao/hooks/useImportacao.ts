import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  importacaoSchema,
  type ImportacaoFormType,
} from '@/data/schemas/importacao';
import { listarEventos, listarLogs } from '@/services/importacao';
import { anoAtual } from '../utils';
import { useImportarInscritos } from './useMutation';

export const useImportacao = () => {
  const [logAberto, setLogAberto] = useState<string | null>(null);
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ImportacaoFormType>({
    resolver: zodResolver(importacaoSchema),
    defaultValues: { ano: anoAtual, referencia: '' },
  });
  const ano = watch('ano');
  const referencia = watch('referencia');

  const eventos = useQuery({
    queryKey: ['importacao', 'eventos', ano],
    queryFn: () => listarEventos(ano),
  });

  const logs = useQuery({
    queryKey: ['importacao', 'logs'],
    queryFn: listarLogs,
  });

  const { mutateAsync, isPending } = useImportarInscritos();

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync(data.referencia);
  });

  const logSelecionado = logs.data?.find(({ id }) => id === logAberto) ?? null;

  const trocarAno = (proximo: number) => {
    setValue('ano', proximo);
    setValue('referencia', '');
  };

  const trocarReferencia = (proxima: string) => {
    setValue('referencia', proxima, { shouldValidate: true });
  };

  const anos = Array.from({ length: 2 }, (_, indice) => anoAtual - indice);

  return {
    errors,
    isSubmitting: isSubmitting || isPending,
    onSubmit,
    ano,
    referencia,
    anoAtual,
    anos,
    eventos: eventos.data ?? [],
    eventosPendentes: eventos.isPending,
    eventosComErro: eventos.isError,
    logs: logs.data ?? [],
    logsPendentes: logs.isPending,
    logsComErro: logs.isError,
    logAberto,
    nomeLogAberto: logSelecionado?.nomeEvento ?? '',
    abrirLog: setLogAberto,
    trocarAno,
    trocarReferencia,
  };
};
