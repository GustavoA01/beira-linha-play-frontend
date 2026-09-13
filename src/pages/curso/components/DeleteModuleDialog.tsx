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
import { Spinner } from '@/components/ui/spinner';

type DeleteModuleDialogPropsType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleName: string;
  onConfirm: () => void;
  isPending?: boolean;
};

export const DeleteModuleDialog = ({
  open,
  onOpenChange,
  moduleName,
  onConfirm,
  isPending = false,
}: DeleteModuleDialogPropsType) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <DialogHeader>
        <DialogTitle>Excluir módulo?</DialogTitle>
        <DialogDescription>
          O módulo {moduleName} será removido. Esta ação não pode ser desfeita.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isPending}>
            Cancelar
          </Button>
        </DialogClose>
        <Button
          type="button"
          variant="destructive"
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? <Spinner /> : 'Excluir'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
