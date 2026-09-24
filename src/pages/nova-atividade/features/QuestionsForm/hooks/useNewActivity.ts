import {
  questionFormSchema,
  type QuestionFormType,
} from '@/data/schemas/activity';
import {
  clearNewActivityStorage,
  getNewActivityStorage,
  type NewActivityStorageType,
} from '@/data/newActivityStorage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { getActivity } from '@/services/atividades';
import {
  emptyQuestion,
  toQuestionForm,
  toSaveActivityPayload,
} from '../../../utils';
import {
  useCreateActivity,
  useUpdateActivity,
} from '../../../hooks/useMutation';
import { useCursoAlocado } from '@/hooks/useCursoAlocado';

export const useNewActivity = () => {
  const navigate = useNavigate();
  const { cursoId, moduloId = '', atividadeId } = useParams();
  const { bloqueado } = useCursoAlocado(cursoId);
  const { mutateAsync: addActivity, isPending: isCreating } =
    useCreateActivity(moduloId);
  const { mutateAsync: editActivity, isPending: isUpdating } =
    useUpdateActivity(moduloId);
  const [localStorageActivityData, setLocalStorageActivityData] =
    useState<NewActivityStorageType | null>(null);

  const { data: existing, isPending: isActivityPending } = useQuery({
    queryKey: queryClientKeys.activityKeys.detail(atividadeId ?? ''),
    queryFn: () => getActivity(atividadeId!),
    enabled: Boolean(atividadeId) && !bloqueado,
  });

  const methods = useForm<QuestionFormType>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: { questions: [] },
  });
  const { reset, control } = methods;

  const { fields } = useFieldArray({
    control,
    name: 'questions',
  });

  useEffect(() => {
    if (atividadeId) return;

    const newActivityData = getNewActivityStorage();

    if (!newActivityData) {
      setLocalStorageActivityData(null);
      return;
    }

    setLocalStorageActivityData(newActivityData);
    reset({
      questions: Array.from({
        length: newActivityData.qtdQuestions ?? 0,
      }).map(emptyQuestion),
    });
  }, [reset, atividadeId]);

  useEffect(() => {
    if (!atividadeId || !existing) return;

    const draft = getNewActivityStorage();
    setLocalStorageActivityData({
      activityName: draft?.activityName || existing.titulo,
      qtdQuestions: existing.questoes?.length ?? existing.quantQuestoes,
      messages: draft?.messages ?? [],
    });
    reset(toQuestionForm(existing));
  }, [atividadeId, existing, reset]);

  const handleCreateActivity = async (data: QuestionFormType) => {
    if (!localStorageActivityData || !cursoId || !moduloId) return;

    const payload = toSaveActivityPayload(
      localStorageActivityData.activityName,
      data.questions
    );

    if (atividadeId) await editActivity({ id: atividadeId, payload });
    else await addActivity(payload);

    clearNewActivityStorage();
    navigate(`/cursos/${cursoId}/modulos/${moduloId}`, { replace: true });
  };

  const isEditing = Boolean(atividadeId);
  const isLoading = isEditing && isActivityPending;
  const isReady = isEditing
    ? Boolean(existing)
    : Boolean(localStorageActivityData);
  const isMissing = !isLoading && !isReady;

  return {
    localStorageActivityData,
    methods,
    fields,
    isSubmitting: methods.formState.isSubmitting || isCreating || isUpdating,
    isLoading,
    isMissing,
    handleCreateActivity,
    bloqueado,
  };
};
