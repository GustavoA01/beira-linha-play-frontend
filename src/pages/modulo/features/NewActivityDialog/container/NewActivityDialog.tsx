import { Dialog, DialogContent } from '@/components/ui/dialog';
import { FormProvider } from 'react-hook-form';
import type { AtividadeType } from '@/data/types/api';
import { Header } from '../components/Header';
import { Form } from '../components/Form';
import { useNewActivityDialog } from '../hooks/useNewActivityDialog';

type NewActivityDialogProps = {
  openActivityDialog: boolean;
  setOpenActivityDialog: (open: boolean) => void;
  atividade?: AtividadeType;
};

export const NewActivityDialog = ({
  openActivityDialog,
  setOpenActivityDialog,
  atividade,
}: NewActivityDialogProps) => {
  const { methods, handleNewActivity, isEditing } =
    useNewActivityDialog(atividade);

  return (
    <Dialog open={openActivityDialog} onOpenChange={setOpenActivityDialog}>
      <DialogContent>
        <Header isEditing={isEditing} />
        <FormProvider {...methods}>
          <Form
            isEditing={isEditing}
            onSubmit={methods.handleSubmit(handleNewActivity)}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
