import { z } from 'zod';

export const courseCodeSchema = z.object({
  code: z.string().trim().min(1, 'Informe o código da turma'),
});

export const newCourseSchema = z.object({
  nome: z.string().trim().min(1, 'Informe o nome do curso'),
  monitorIds: z.array(z.string()).min(1, 'Adicione pelo menos um monitor'),
});

export type CourseCodeFormType = z.infer<typeof courseCodeSchema>;
export type NewCourseFormType = z.infer<typeof newCourseSchema>;
