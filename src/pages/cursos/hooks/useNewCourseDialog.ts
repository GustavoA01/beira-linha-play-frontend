import { newCourseSchema, type NewCourseFormType } from '@/data/schemas/course';
import type { CursoType, MonitorType } from '@/data/types/api';
import { monitorKeys } from '@/lib/queryClientKeys';
import { listMonitors } from '@/services/usuarios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateCourse, useUpdateCourse } from './useMutation';
import { valuesFromCourse } from '../utils';

export const useNewCourseDialog = (
  onOpenChange: (open: boolean) => void,
  curso?: CursoType
) => {
  const { data: users = [] } = useQuery({
    queryKey: monitorKeys.all,
    queryFn: listMonitors,
  });
  const monitores = users.filter(
    (user): user is MonitorType => user.tipo === 'MONITOR'
  );
  const { mutateAsync: addCourse, isPending: isCreating } = useCreateCourse();
  const { mutateAsync: editCourse, isPending: isUpdating } = useUpdateCourse();
  const methods = useForm<NewCourseFormType>({
    resolver: zodResolver(newCourseSchema),
    defaultValues: valuesFromCourse(curso),
  });
  const [pendingMonitorId, setPendingMonitorId] = useState('');
  const isSubmitting =
    methods.formState.isSubmitting || isCreating || isUpdating;

  const monitorIds = methods.watch('monitorIds');
  const monitoresDisponiveis = monitores.filter(
    (monitor) => !monitorIds.includes(monitor.id)
  );
  const monitoresSelecionados = monitores.filter((monitor) =>
    monitorIds.includes(monitor.id)
  );

  useEffect(() => {
    methods.reset(valuesFromCourse(curso));
    setPendingMonitorId('');
  }, [curso, methods]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      methods.reset(valuesFromCourse(curso));
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

  const onSubmit = methods.handleSubmit(async (data: NewCourseFormType) => {
    if (curso) await editCourse({ id: curso.id, payload: data });
    else await addCourse(data);

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
    canSubmit: monitorIds.length > 0 && !isSubmitting,
    isSubmitting,
    isEditing: Boolean(curso),
  };
};
