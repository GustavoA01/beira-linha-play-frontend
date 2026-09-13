import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { ApiError } from '@/services/api';
import { createCourse, deleteCourse, updateCourse } from '@/services/cursos';
import { courseKeys } from '@/lib/queryClientKeys';
import type { SaveCoursePayloadType } from '@/data/types/services';

const toastError = (error: unknown, fallback: string) => {
  console.error(error);
  toast.add({
    type: 'error',
    title: error instanceof ApiError ? error.message : fallback,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.add({
        type: 'success',
        title: 'Curso adicionado',
      });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível adicionar o curso');
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SaveCoursePayloadType;
    }) => updateCourse(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.add({
        type: 'success',
        title: 'Curso atualizado',
      });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível atualizar o curso');
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.add({
        type: 'success',
        title: 'Curso excluído',
      });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível excluir o curso');
    },
  });
};
