import {
  newActivitySchema,
  type NewActivityFormType,
} from '@/data/schemas/activity';
import { setNewActivityStorage } from '@/data/newActivityStorage';
import type { AtividadeType } from '@/data/types/api';
import { useConfiguracao } from '@/hooks/useConfiguracao';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

const valuesFromActivity = (
  atividade: AtividadeType | undefined,
  quantidadePadrao: number
): NewActivityFormType => {
  if (!atividade) {
    return {
      activityName: '',
      qtdQuestions: quantidadePadrao,
      permiteMaisTentativas: true,
    };
  }

  return {
    activityName: atividade.titulo,
    qtdQuestions: atividade.quantQuestoes || quantidadePadrao,
    permiteMaisTentativas: atividade.permiteMaisTentativas !== false,
  };
};

export const useNewActivityDialog = (atividade?: AtividadeType) => {
  const navigate = useNavigate();
  const { cursoId, moduloId } = useParams();
  const configQuery = useConfiguracao();
  const config = configQuery.data;
  const quantidade = config?.quantidadeQuestoesPadrao ?? 1;
  const isEditing = Boolean(atividade?.id);
  const quantidadeTravada =
    Boolean(config?.quantidadeQuestoesTravada) && !isEditing;
  const schemaRef = useRef(newActivitySchema());
  schemaRef.current = newActivitySchema({
    lockCount: quantidadeTravada,
    count: quantidade,
  });

  const methods = useForm<NewActivityFormType>({
    resolver: (values, context, options) =>
      zodResolver(schemaRef.current)(values, context, options),
    defaultValues: valuesFromActivity(atividade, quantidade),
  });

  useEffect(() => {
    methods.reset(valuesFromActivity(atividade, quantidade));
  }, [atividade, quantidade, methods]);

  const handleNewActivity = (data: NewActivityFormType) => {
    setNewActivityStorage({
      activityName: data.activityName,
      qtdQuestions: atividade?.id ? atividade.quantQuestoes : data.qtdQuestions,
      permiteMaisTentativas: data.permiteMaisTentativas,
      messages: [],
    });
    const basePath = `/cursos/${cursoId}/modulos/${moduloId}/nova-atividade`;
    navigate(atividade?.id ? `${basePath}/${atividade.id}` : basePath);
  };

  return {
    methods,
    handleNewActivity,
    isEditing,
    quantidadeTravada,
    configPending: configQuery.isPending,
  };
};
