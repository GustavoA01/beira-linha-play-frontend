import { Dialog, DialogContent } from '@/components/ui/dialog';
import { FormProvider } from 'react-hook-form';
import type { AtividadeType } from '@/data/types/api';
import { Header } from '../components/Header';
import { Form } from '../components/Form';
import { useNewActivityDialog } from '../hooks/useNewActivityDialog';
import { Spinner } from '@/components/ui/spinner';

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
  const {
    methods,
    handleNewActivity,
    isEditing,
    quantidadeTravada,
    configPending,
  } = useNewActivityDialog(atividade);

  return (
    <Dialog open={openActivityDialog} onOpenChange={setOpenActivityDialog}>
      <DialogContent>
        <Header isEditing={isEditing} />
        {configPending ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : (
          <FormProvider {...methods}>
            <Form
              isEditing={isEditing}
              quantidadeTravada={quantidadeTravada}
              onSubmit={methods.handleSubmit(handleNewActivity)}
            />
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
};
