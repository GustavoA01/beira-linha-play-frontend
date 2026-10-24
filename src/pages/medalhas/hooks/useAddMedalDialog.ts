import { addMedalSchema, type AddMedalFormType } from '@/data/schemas/medal';
import { ApiError } from '@/services/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type ChangeEvent, type DragEvent } from 'react';
import { useController, useForm } from 'react-hook-form';
import { useCreateMedal } from './useMutation';

export const useAddMedalDialog = (onOpenChange: (open: boolean) => void) => {
  const [isDragging, setIsDragging] = useState(false);
  const { mutateAsync: addMedal, isPending } = useCreateMedal();
  const methods = useForm<AddMedalFormType>({
    resolver: zodResolver(addMedalSchema),
    defaultValues: {
      nome: '',
      pontosMin: 0,
    },
  });

  const { field: imageField } = useController({
    name: 'imagem',
    control: methods.control,
  });
  const imageFile = imageField.value;
  const selectImage = (file: File) => {
    methods.clearErrors('imagem');
    methods.setValue('imagem', file, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) selectImage(file);
  };
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(
    null
  );

  useEffect(() => {
    if (!imageFile?.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreview({ file: imageFile, url: reader.result });
      }
    };
    reader.readAsDataURL(imageFile);
    return () => {
      reader.onload = null;
      if (reader.readyState === FileReader.LOADING) reader.abort();
    };
  }, [imageFile]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      methods.reset();
      setPreview(null);
      setIsDragging(false);
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = methods.handleSubmit(async (data: AddMedalFormType) => {
    const imagem = data.imagem;
    if (!imagem) {
      methods.setError('imagem', { message: 'Selecione uma imagem' });
      return;
    }

    methods.clearErrors('root');
    try {
      await addMedal({
        nome: data.nome,
        pontosMin: data.pontosMin,
        imagem,
      });
      handleOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError) {
        methods.setError('root', { message: error.message });
        return;
      }
      methods.setError('imagem', {
        message: 'Não foi possível enviar a imagem. Tente de novo.',
      });
    }
  });

  const handleImageDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (methods.formState.isSubmitting || isPending) return;
    const files = event.dataTransfer.files;
    if (!files.length) return;
    if (files.length > 1) {
      methods.setError('imagem', {
        message: 'Envie apenas uma imagem por medalha',
      });
      return;
    }
    selectImage(files[0]);
  };
  return {
    isDragging,
    setIsDragging,
    handleImageDrop,
    handleImageChange,
    imageName: imageFile?.name,
    imageSizeError:
      imageFile?.size > 2 * 1024 * 1024
        ? `Esta imagem tem ${(imageFile.size / (1024 * 1024)).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} MB e ultrapassa o limite de 2 MB. Reduza o tamanho ou escolha outra imagem.`
        : undefined,
    imagePreview: preview?.file === imageFile ? preview?.url : undefined,
    onSubmit,
    register: methods.register,
    errors: methods.formState.errors,
    isSubmitting: methods.formState.isSubmitting || isPending,
    handleOpenChange,
  };
};
