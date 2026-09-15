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
import { ConfirmCourseCodeInput } from '@/components/ConfirmCourseCodeInput';
import { Spinner } from '@/components/ui/spinner';
import { useConfirmCourseCode } from '@/hooks/useConfirmCourseCode';

type DeleteModuleDialogPropsType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleName: string;
  codigoAcesso: string;
  onConfirm: () => void;
  isPending?: boolean;
};

export const DeleteModuleDialog = ({
  open,
  onOpenChange,
  moduleName,
  codigoAcesso,
  onConfirm,
  isPending = false,
}: DeleteModuleDialogPropsType) => {
  const { code, error, onCodeChange, confirmIfMatches } = useConfirmCourseCode(
    open,
    codigoAcesso
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Excluir módulo?</DialogTitle>
          <DialogDescription>
            O módulo {moduleName} será removido junto com todas as atividades
            dele. Esta ação é irreversível.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            confirmIfMatches(onConfirm);
          }}
        >
          <ConfirmCourseCodeInput
            value={code}
            onChange={onCodeChange}
            error={error}
            disabled={isPending}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? <Spinner /> : 'Excluir'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
