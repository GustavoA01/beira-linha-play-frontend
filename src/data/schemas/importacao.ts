import { z } from 'zod';

export const importacaoSchema = z.object({
  ano: z.number().int().min(2000, 'Informe um ano válido').max(2100),
  referencia: z.string().trim().min(1, 'Selecione o evento'),
});

export type ImportacaoFormType = z.infer<typeof importacaoSchema>;
