import { toast } from '@/components/ui/toast';
import { addMedalSchema, type AddMedalFormType } from '@/data/schemas/medal';
import { ApiError } from '@/services/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCreateMedal } from './useMutation';

export const useAddMedalDialog = (onOpenChange: (open: boolean) => void) => {
  const { mutateAsync: addMedal, isPending } = useCreateMedal();
  const methods = useForm<AddMedalFormType>({
    resolver: zodResolver(addMedalSchema),
    defaultValues: {
      nome: '',
      pontosMin: 0,
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) methods.reset();
    onOpenChange(nextOpen);
  };

  const onSubmit = methods.handleSubmit(async (data: AddMedalFormType) => {
    const imagem = data.imagem.item(0);
    if (!imagem) {
      toast.add({
        type: 'error',
        title: 'Erro ao enviar a imagem',
      });
      return;
    }

    try {
      await addMedal({
        nome: data.nome,
        pontosMin: data.pontosMin,
        imagem,
      });
      handleOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError) return;
      methods.setError('imagem', {
        message: 'Não foi possível enviar a imagem. Tente de novo.',
      });
      toast.add({
        type: 'error',
        title: 'Não foi possível enviar a imagem.',
      });
    }
  });

  return {
    onSubmit,
    register: methods.register,
    errors: methods.formState.errors,
    isSubmitting: methods.formState.isSubmitting || isPending,
    handleOpenChange,
  };
};
