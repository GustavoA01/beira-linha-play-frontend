import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { toast } from '@/components/ui/toast';
import { toastError } from '@/lib/utils';
import {
  createCourse,
  deleteCourse,
  enrollCourse,
  updateCourse,
} from '@/services/cursos';
import { createAdmin } from '@/services/usuarios';
import type { SaveCoursePayloadType } from '@/data/types/services';

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryClientKeys.courseKeys.all,
      });
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
      void queryClient.invalidateQueries({
        queryKey: queryClientKeys.courseKeys.all,
      });
      toast.add({
        type: 'success',
        title: 'Curso atualizado',
      });
    },
    onError: (error) => toastError(error, 'Não foi possível atualizar o curso'),
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryClientKeys.courseKeys.all,
      });
      toast.add({
        type: 'success',
        title: 'Curso excluído',
      });
    },
    onError: (error) => toastError(error, 'Não foi possível excluir o curso'),
  });
};

export const useCreateAdmin = () =>
  useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      toast.add({
        type: 'success',
        title: 'Administrador adicionado',
      });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível adicionar o administrador');
    },
  });

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (codigoAcesso: string) => enrollCourse({ codigoAcesso }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryClientKeys.courseKeys.all,
      });
      toast.add({
        type: 'success',
        title: 'Você entrou na turma',
      });
    },
  });
};
