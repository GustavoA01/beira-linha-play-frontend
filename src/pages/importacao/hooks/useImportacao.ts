import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  importacaoSchema,
  type ImportacaoFormType,
} from '@/data/schemas/importacao';
import { listarCursos, listarEventos, listarLogs } from '@/services/importacao';
import { anoAtual } from '../utils';
import { useImportarInscritos } from './useMutation';

export const useImportacao = () => {
  const [logAberto, setLogAberto] = useState<string | null>(null);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [referenciaCursos, setReferenciaCursos] = useState('');
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

  const cursos = useQuery({
    queryKey: ['importacao', 'cursos', referencia],
    queryFn: () => listarCursos(referencia),
    enabled: referencia.trim().length > 0,
  });

  useEffect(() => {
    if (!referencia || !cursos.data || referenciaCursos === referencia) {
      return;
    }
    setSelecionados(cursos.data);
    setReferenciaCursos(referencia);
  }, [referencia, cursos.data, referenciaCursos]);

  const { mutateAsync, isPending } = useImportarInscritos();

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync({ referencia: data.referencia, cursos: selecionados });
  });

  const logSelecionado = logs.data?.find(({ id }) => id === logAberto) ?? null;

  const limparCursos = () => {
    setSelecionados([]);
    setReferenciaCursos('');
  };

  const trocarAno = (proximo: number) => {
    setValue('ano', proximo);
    setValue('referencia', '');
    limparCursos();
  };

  const trocarReferencia = (proxima: string) => {
    setValue('referencia', proxima, { shouldValidate: true });
    limparCursos();
  };

  const alternarCurso = (nome: string) => {
    setSelecionados((atual) =>
      atual.includes(nome)
        ? atual.filter((item) => item !== nome)
        : [...atual, nome]
    );
  };

  const alternarTodos = (marcar: boolean) => {
    setSelecionados(marcar ? (cursos.data ?? []) : []);
  };

  const consultaCursosAtiva = referencia.trim().length > 0;

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
    cursos: cursos.data ?? [],
    selecionados,
    cursosPendentes: consultaCursosAtiva && cursos.isLoading,
    cursosComErro: consultaCursosAtiva && cursos.isError,
    alternarCurso,
    alternarTodos,
  };
};
