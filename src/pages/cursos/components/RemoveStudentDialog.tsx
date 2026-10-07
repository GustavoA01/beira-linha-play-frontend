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

type RemoveStudentDialogPropsType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  courseName: string;
  onConfirm: () => void;
  isPending?: boolean;
};

export const RemoveStudentDialog = ({
  open,
  onOpenChange,
  studentName,
  courseName,
  onConfirm,
  isPending = false,
}: RemoveStudentDialogPropsType) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <DialogHeader>
        <DialogTitle>Remover aluno?</DialogTitle>
        <DialogDescription>
          {studentName} será removido do curso {courseName}. Esta ação não pode
          ser desfeita.
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
          {isPending ? <Spinner /> : 'Remover'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
