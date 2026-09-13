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
import type { ModuloType } from '@/data/types/api';
import { useNewModuleDialog } from '../hooks/useNewModuleDialog';

type NewModuleDialogPropsType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  modulo?: ModuloType;
};

export const NewModuleDialog = ({
  open,
  onOpenChange,
  courseId,
  modulo,
}: NewModuleDialogPropsType) => {
  const {
    register,
    onSubmit,
    errors,
    handleOpenChange,
    isSubmitting,
    isEditing,
  } = useNewModuleDialog(onOpenChange, courseId, modulo);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar módulo' : 'Novo módulo'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere o nome do módulo.'
              : 'Informe o nome do módulo para adicioná-lo ao curso.'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <LabelInput
            label="Nome"
            id="nome"
            autoFocus
            placeholder="Ex.: Derivadas"
            error={errors.nome?.message}
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
              {isSubmitting ? <Spinner /> : isEditing ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
