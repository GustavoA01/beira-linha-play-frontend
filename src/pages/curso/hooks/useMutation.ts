import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { ApiError } from '@/services/api';
import { createModule, deleteModule, updateModule } from '@/services/modulos';
import { courseKeys, moduleKeys } from '@/lib/queryClientKeys';
import type {
  CourseResponseType,
  ModuleResponseType,
  SaveModulePayloadType,
} from '@/data/types/services';

const toastError = (error: unknown, fallback: string) => {
  console.error(error);
  toast.add({
    type: 'error',
    title: error instanceof ApiError ? error.message : fallback,
  });
};

const addCreatedModuleToCourse = (
  queryClient: ReturnType<typeof useQueryClient>,
  courseId: string,
  created: ModuleResponseType
) => {
  queryClient.setQueryData<CourseResponseType>(
    courseKeys.detail(courseId),
    (current) => {
      if (!current) return current;

      const modulos = current.modulos ?? [];
      if (modulos.some((item) => item.id === created.id)) return current;

      return {
        ...current,
        modulos: [
          ...modulos,
          {
            id: created.id,
            nome: created.nome,
            cursoId: created.cursoId ?? courseId,
            atividades: created.atividades ?? [],
            quantAtividades: created.atividades?.length ?? 0,
          },
        ],
      };
    }
  );
  queryClient.setQueryData(moduleKeys.detail(created.id), created);
};

const invalidateModuleQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  courseId: string
) => {
  void queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
  void queryClient.invalidateQueries({ queryKey: courseKeys.all });
  void queryClient.invalidateQueries({ queryKey: moduleKeys.all });
};

export const useCreateModule = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveModulePayloadType) =>
      createModule(courseId, payload),
    onSuccess: (created) => {
      addCreatedModuleToCourse(queryClient, courseId, created);
      void queryClient.invalidateQueries({
        queryKey: courseKeys.all,
        exact: true,
      });
      toast.add({
        type: 'success',
        title: 'Módulo adicionado',
      });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível adicionar o módulo');
    },
  });
};

export const useUpdateModule = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SaveModulePayloadType;
    }) => updateModule(id, payload),
    onSuccess: () => {
      invalidateModuleQueries(queryClient, courseId);
      toast.add({
        type: 'success',
        title: 'Módulo atualizado',
      });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível atualizar o módulo');
    },
  });
};

export const useDeleteModule = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteModule,
    onSuccess: () => {
      invalidateModuleQueries(queryClient, courseId);
      toast.add({
        type: 'success',
        title: 'Módulo excluído',
      });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível excluir o módulo');
    },
  });
};
