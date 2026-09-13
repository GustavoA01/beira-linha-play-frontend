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

type DeleteCourseDialogPropsType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseName: string;
  onConfirm: () => void;
  isPending?: boolean;
};

export const DeleteCourseDialog = ({
  open,
  onOpenChange,
  courseName,
  onConfirm,
  isPending = false,
}: DeleteCourseDialogPropsType) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <DialogHeader>
        <DialogTitle>Excluir curso?</DialogTitle>
        <DialogDescription>
          O curso {courseName} será removido. Esta ação não pode ser desfeita.
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
