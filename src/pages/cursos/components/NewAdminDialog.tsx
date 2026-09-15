import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LabelInput } from '@/components/LabelInput';
import { Spinner } from '@/components/ui/spinner';
import { useNewAdminDialog } from '../hooks/useNewAdminDialog';

type NewAdminDialogPropsType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const NewAdminDialog = ({
  open,
  onOpenChange,
}: NewAdminDialogPropsType) => {
  const { register, onSubmit, errors, isSubmitting, handleOpenChange } =
    useNewAdminDialog(onOpenChange);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo administrador</DialogTitle>
          <DialogDescription>
            Informe o nome e a senha do novo usuário administrador.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <LabelInput
            id="nome"
            label="Nome"
            autoFocus
            autoComplete="name"
            placeholder="Ex.: Ana Oliveira"
            error={errors.nome?.message}
            register={register}
            disabled={isSubmitting}
          />
          <LabelInput
            id="senha"
            label="Senha"
            type="password"
            autoComplete="new-password"
            error={errors.senha?.message}
            register={register}
            disabled={isSubmitting}
          />
          <LabelInput
            id="confirmarSenha"
            label="Confirmar senha"
            type="password"
            autoComplete="new-password"
            error={errors.confirmarSenha?.message}
            register={register}
            disabled={isSubmitting}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
