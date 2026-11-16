import { z } from 'zod';

const activityNameSchema = z
  .string()
  .trim()
  .min(1, 'O nome da atividade é obrigatório')
  .min(3, 'A atividade deve ter pelo menos 3 letras');

const questionCountSchema = z
  .number()
  .min(1, 'Defina o número de perguntas')
  .min(1, 'O número mínimo de perguntas é 1')
  .max(10, 'O número máximo de perguntas é 10');

const xpSchema = z
  .number()
  .min(1, 'Defina a quantidade de XP')
  .max(3, 'XP máximo é 3');

const baseNewActivitySchema = z.object({
  activityName: activityNameSchema,
  permiteMaisTentativas: z.boolean(),
  qtdQuestions: questionCountSchema,
});

export const newActivitySchema = (options?: {
  lockCount?: boolean;
  count?: number;
}) => {
  if (!options?.lockCount) return baseNewActivitySchema;

  return baseNewActivitySchema.extend({
    qtdQuestions: z.number().refine((value) => value === options.count, {
      message: 'A quantidade de questões está definida pelo administrador',
    }),
  });
};

const alternativeSchema = z.object({
  text: z.string().trim().min(1, 'O texto da alternativa é obrigatório'),
  isCorrect: z.boolean(),
});

const questionFields = {
  statement: z.string().trim().min(1, 'O enunciado da pergunta é obrigatório'),
  alternatives: z
    .array(alternativeSchema)
    .min(2, 'A pergunta deve ter pelo menos 2 alternativas')
    .max(4, 'A pergunta deve ter no máximo 4 alternativas')
    .refine((alts) => alts.some((alt) => alt.isCorrect === true), {
      message: 'Você precisa marcar uma alternativa como correta',
      path: [''],
    }),
};

const baseQuestionSchema = z.object({
  ...questionFields,
  xp: xpSchema,
});

const questionSchema = (options?: { lockXp?: boolean; xp?: number }) => {
  if (!options?.lockXp) return baseQuestionSchema;

  return z.object({
    ...questionFields,
    xp: z.number().refine((value) => value === options.xp, {
      message: 'Os pontos da questão estão definidos pelo administrador',
    }),
  });
};

const baseQuestionFormSchema = z.object({
  questions: z.array(baseQuestionSchema),
});

export const questionFormSchema = (options?: {
  lockXp?: boolean;
  xp?: number;
}) => {
  if (!options?.lockXp) return baseQuestionFormSchema;

  return z.object({
    questions: z.array(questionSchema(options)),
  });
};

export type NewActivityFormType = z.infer<typeof baseNewActivitySchema>;
export type QuestionFormType = z.infer<typeof baseQuestionFormSchema>;
