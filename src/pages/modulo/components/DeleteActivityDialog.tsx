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

type DeleteActivityDialogPropsType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityName: string;
  codigoAcesso: string;
  onConfirm: () => void;
  isPending?: boolean;
};

export const DeleteActivityDialog = ({
  open,
  onOpenChange,
  activityName,
  codigoAcesso,
  onConfirm,
  isPending = false,
}: DeleteActivityDialogPropsType) => {
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
          <DialogTitle>Excluir atividade?</DialogTitle>
          <DialogDescription>
            A atividade {activityName} será removida. Esta ação é irreversível.
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
