import {
  newActivitySchema,
  type NewActivityFormType,
} from '@/data/schemas/activity';
import { setNewActivityStorage } from '@/data/newActivityStorage';
import type { AtividadeType } from '@/data/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

const valuesFromActivity = (atividade?: AtividadeType): NewActivityFormType => {
  if (!atividade) return { activityName: '', qtdQuestions: 0 };

  return {
    activityName: atividade.titulo,
    qtdQuestions: atividade.quantQuestoes || 1,
  };
};

export const useNewActivityDialog = (atividade?: AtividadeType) => {
  const navigate = useNavigate();
  const { cursoId, moduloId } = useParams();
  const methods = useForm<NewActivityFormType>({
    resolver: zodResolver(newActivitySchema),
    defaultValues: valuesFromActivity(atividade),
  });

  useEffect(() => {
    methods.reset(valuesFromActivity(atividade));
  }, [atividade, methods]);

  const handleNewActivity = (data: NewActivityFormType) => {
    setNewActivityStorage({
      activityName: data.activityName,
      qtdQuestions: atividade?.id ? atividade.quantQuestoes : data.qtdQuestions,
      messages: [],
    });
    const basePath = `/cursos/${cursoId}/modulos/${moduloId}/nova-atividade`;
    navigate(atividade?.id ? `${basePath}/${atividade.id}` : basePath);
  };

  return { methods, handleNewActivity, isEditing: Boolean(atividade?.id) };
};
