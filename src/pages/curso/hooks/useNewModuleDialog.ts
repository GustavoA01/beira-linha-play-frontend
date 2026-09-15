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
  const methods = useForm<NewModuleFormType>({
    resolver: zodResolver(newModuleSchema),
    defaultValues: valuesFromModule(modulo),
  });
  const isSubmitting =
    methods.formState.isSubmitting || isCreating || isUpdating;

  useEffect(() => {
    methods.reset(valuesFromModule(modulo));
  }, [modulo, methods]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) methods.reset(valuesFromModule(modulo));
    onOpenChange(nextOpen);
  };

  const onSubmit = methods.handleSubmit(async (data: NewModuleFormType) => {
    if (modulo) await editModule({ id: modulo.id, payload: data });
    else await addModule(data);
    handleOpenChange(false);
  });

  return {
    onSubmit,
    register: methods.register,
    errors: methods.formState.errors,
    handleOpenChange,
    isSubmitting,
    isEditing: Boolean(modulo),
  };
};
