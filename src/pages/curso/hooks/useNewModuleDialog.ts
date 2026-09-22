import { newModuleSchema, type NewModuleFormType } from '@/data/schemas/module';
import type { ModuloType } from '@/data/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateModule, useUpdateModule } from './useMutation';

const emptyValues: NewModuleFormType = {
  nome: '',
};

const valuesFromModule = (modulo?: ModuloType): NewModuleFormType => {
  if (!modulo) return emptyValues;
  return { nome: modulo.nome };
};

export const useNewModuleDialog = (
  onOpenChange: (open: boolean) => void,
  courseId: string,
  modulo?: ModuloType
) => {
  const { mutateAsync: addModule, isPending: isCreating } =
    useCreateModule(courseId);
  const { mutateAsync: editModule, isPending: isUpdating } =
    useUpdateModule(courseId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: formSubmitting, errors },
  } = useForm<NewModuleFormType>({
    resolver: zodResolver(newModuleSchema),
    defaultValues: valuesFromModule(modulo),
  });

  useEffect(() => {
    reset(valuesFromModule(modulo));
  }, [modulo, reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset(valuesFromModule(modulo));
    onOpenChange(nextOpen);
  };

  const onSubmit = handleSubmit(async (data: NewModuleFormType) => {
    if (modulo) await editModule({ id: modulo.id, payload: data });
    else await addModule(data);
    handleOpenChange(false);
  });

  const isSubmitting = formSubmitting || isCreating || isUpdating;

  return {
    onSubmit,
    register: register,
    errors: errors,
    handleOpenChange,
    isSubmitting,
    isEditing: Boolean(modulo),
  };
};
