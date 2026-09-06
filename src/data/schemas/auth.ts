import { z } from 'zod';

export const registerSchema = z
  .object({
    tipo: z.enum(['ALUNO', 'MONITOR']),
    nome: z.string().trim().min(1, 'Informe o nome'),
    apelido: z.string().trim(),
    email: z.string().trim(),
    senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmarSenha: z.string().min(1, 'Confirme a senha'),
  })
  .superRefine((data, ctx) => {
    if (data.senha !== data.confirmarSenha) {
      ctx.addIssue({
        code: 'custom',
        message: 'As senhas não coincidem',
        path: ['confirmarSenha'],
      });
    }

    if (data.tipo === 'ALUNO' && data.apelido.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Informe o apelido',
        path: ['apelido'],
      });
    }

    if (data.tipo === 'MONITOR' && !z.email().safeParse(data.email).success) {
      ctx.addIssue({
        code: 'custom',
        message: 'Informe um e-mail válido',
        path: ['email'],
      });
    }
  });

export const loginSchema = z
  .object({
    tipo: z.enum(['ALUNO', 'MONITOR']),
    apelido: z.string().trim(),
    email: z.string().trim(),
    senha: z.string().min(1, 'Informe a senha'),
  })
  .superRefine((data, ctx) => {
    if (data.tipo === 'ALUNO' && data.apelido.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Informe o apelido',
        path: ['apelido'],
      });
    }

    if (data.tipo === 'MONITOR' && !z.email().safeParse(data.email).success) {
      ctx.addIssue({
        code: 'custom',
        message: 'Informe um e-mail válido',
        path: ['email'],
      });
    }
  });

export const editAccountSchema = z
  .object({
    tipo: z.enum(['ALUNO', 'MONITOR', 'ADMIN']),
    nome: z.string().trim().min(1, 'Informe o nome'),
    apelido: z.string().trim(),
    email: z.string().trim(),
    senha: z.string(),
    confirmarSenha: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.senha.length > 0 && data.senha.length < 6) {
      ctx.addIssue({
        code: 'custom',
        message: 'A senha deve ter pelo menos 6 caracteres',
        path: ['senha'],
      });
    }

    if (data.senha !== data.confirmarSenha) {
      ctx.addIssue({
        code: 'custom',
        message: 'As senhas não coincidem',
        path: ['confirmarSenha'],
      });
    }

    if (data.tipo === 'ALUNO' && data.apelido.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Informe o apelido',
        path: ['apelido'],
      });
    }

    if (data.tipo === 'MONITOR' && !z.email().safeParse(data.email).success) {
      ctx.addIssue({
        code: 'custom',
        message: 'Informe um e-mail válido',
        path: ['email'],
      });
    }
  });

export const newAdminSchema = z
  .object({
    nome: z.string().trim().min(1, 'Informe o nome'),
    senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmarSenha: z.string().min(1, 'Confirme a senha'),
  })
  .superRefine((data, ctx) => {
    if (data.senha !== data.confirmarSenha) {
      ctx.addIssue({
        code: 'custom',
        message: 'As senhas não coincidem',
        path: ['confirmarSenha'],
      });
    }
  });

export type RegisterFormType = z.infer<typeof registerSchema>;
export type RegisterRoleType = RegisterFormType['tipo'];

export type LoginFormType = z.infer<typeof loginSchema>;
export type LoginRoleType = LoginFormType['tipo'];

export type EditAccountFormType = z.infer<typeof editAccountSchema>;
export type NewAdminFormType = z.infer<typeof newAdminSchema>;
