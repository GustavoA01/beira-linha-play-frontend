import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const Header = ({ isEditing }: { isEditing?: boolean }) => (
  <DialogHeader>
    <DialogTitle>
      {isEditing ? 'Editar atividade' : 'Nova Atividade'}
    </DialogTitle>
    <DialogDescription>
      {isEditing
        ? 'Altere o nome da atividade e continue para as perguntas.'
        : 'Defina o nome do quiz e quantas perguntas ele terá.'}
    </DialogDescription>
  </DialogHeader>
);
