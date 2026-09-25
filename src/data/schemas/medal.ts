import { z } from 'zod';

export const addMedalSchema = z.object({
  nome: z.string().trim().min(1, 'Informe o nome da medalha'),
  pontosMin: z
    .number({ error: 'Informe os pontos mínimos' })
    .int('Use um número inteiro')
    .min(0, 'Os pontos mínimos não podem ser negativos'),
  imagem: z
    .custom<FileList>(
      (value) => value instanceof FileList && value.length > 0,
      { error: 'Selecione uma imagem' }
    )
    .refine((files) => files[0].type.startsWith('image/'), {
      error: 'Envie um arquivo de imagem',
    })
    .refine((files) => files[0].size <= 2 * 1024 * 1024, {
      error: 'A imagem deve ter no máximo 2 MB',
    }),
});

export type AddMedalFormType = z.infer<typeof addMedalSchema>;
