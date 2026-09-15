import { DialogTitle } from '@radix-ui/react-dialog';
import type { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProvider } from '@/providers/UserProvider';
import { useLogout } from '@/pages/auth/hooks/useMutation';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from './ui/dialog';

type LogoutDialogProps = {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

export const LogoutDialog = ({
  openDialog,
  setOpenDialog,
}: LogoutDialogProps) => {
  const { setUser } = useUserProvider();
  const navigate = useNavigate();
  const { mutateAsync: signOut, isPending } = useLogout();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      // Keep going so an expired session still leaves the app.
    } finally {
      setUser(null);
      setOpenDialog(false);
      navigate('/login', { replace: true });
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deseja mesmo sair da sua conta?</DialogTitle>
          <DialogDescription>
            Você será redirecionado para a tela de login.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : 'Sair'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
