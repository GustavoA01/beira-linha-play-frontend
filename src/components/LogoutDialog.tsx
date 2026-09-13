import { DialogTitle } from '@radix-ui/react-dialog';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProvider } from '@/providers/UserProvider';
import { logout } from '@/services/auth';
import { Button } from './ui/button';
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
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);
    try {
      await logout();
    } catch {
      // Keep going so an expired session still leaves the app.
    } finally {
      setUser(null);
      setOpenDialog(false);
      navigate('/login', { replace: true });
      setPending(false);
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
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={pending}
          >
            Sair
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
