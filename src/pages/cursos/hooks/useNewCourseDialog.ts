import { newCourseSchema, type NewCourseFormType } from '@/data/schemas/course';
import { temporaryMonitores } from '@/data/temporaryMocks/monitores';
import type { CursoType } from '@/data/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const emptyValues: NewCourseFormType = {
  nome: '',
  monitorIds: [],
};

const valuesFromCurso = (curso?: CursoType): NewCourseFormType => {
  if (!curso) return emptyValues;
  return { nome: curso.nome, monitorIds: curso.monitorIds };
};

export const useNewCourseDialog = (
  onOpenChange: (open: boolean) => void,
  curso?: CursoType
) => {
  const methods = useForm<NewCourseFormType>({
    resolver: zodResolver(newCourseSchema),
    defaultValues: valuesFromCurso(curso),
  });
  const [pendingMonitorId, setPendingMonitorId] = useState('');

  const monitorIds = methods.watch('monitorIds');
  const monitoresDisponiveis = temporaryMonitores.filter(
    (monitor) => !monitorIds.includes(monitor.id)
  );
  const monitoresSelecionados = temporaryMonitores.filter((monitor) =>
    monitorIds.includes(monitor.id)
  );

  useEffect(() => {
    methods.reset(valuesFromCurso(curso));
    setPendingMonitorId('');
  }, [curso, methods]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      methods.reset(valuesFromCurso(curso));
      setPendingMonitorId('');
    }
    onOpenChange(nextOpen);
  };

  const addMonitor = () => {
    if (!pendingMonitorId || monitorIds.includes(pendingMonitorId)) return;
    methods.setValue('monitorIds', [...monitorIds, pendingMonitorId], {
      shouldValidate: true,
    });
    setPendingMonitorId('');
  };

  const removeMonitor = (id: string) => {
    methods.setValue(
      'monitorIds',
      monitorIds.filter((monitorId) => monitorId !== id),
      { shouldValidate: true }
    );
  };

  const onSubmit = methods.handleSubmit((data: NewCourseFormType) => {
    console.log(data);
    handleOpenChange(false);
  });

  return {
    onSubmit,
    register: methods.register,
    errors: methods.formState.errors,
    handleOpenChange,
    pendingMonitorId,
    setPendingMonitorId,
    addMonitor,
    removeMonitor,
    monitoresDisponiveis,
    monitoresSelecionados,
    canSubmit: monitorIds.length > 0 && temporaryMonitores.length > 0,
    isEditing: Boolean(curso),
  };
};
