import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EnterAsButtonsPropsType = {
  isAluno: boolean;
  isAdmin?: boolean;
  onEnterAsStudent: () => void;
  onEnterAsMonitor: () => void;
  onEnterAsAdmin?: () => void;
};

export const EnterAsButtons = ({
  isAluno,
  isAdmin = false,
  onEnterAsStudent,
  onEnterAsMonitor,
  onEnterAsAdmin,
}: EnterAsButtonsPropsType) => {
  const isMonitor = !isAluno && !isAdmin;

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-2',
        !onEnterAsAdmin && 'sm:grid-cols-2'
      )}
    >
      <Button
        type="button"
        variant={isAluno ? 'default' : 'outline'}
        className="h-auto whitespace-normal px-3 py-2 font-montserrat"
        onClick={onEnterAsStudent}
      >
        Entrar como aluno
      </Button>
      <Button
        type="button"
        variant={isMonitor ? 'default' : 'outline'}
        className="h-auto whitespace-normal px-3 py-2 font-montserrat"
        onClick={onEnterAsMonitor}
      >
        Entrar como monitor
      </Button>
      {onEnterAsAdmin && (
        <Button
          type="button"
          variant={isAdmin ? 'default' : 'outline'}
          className="h-auto whitespace-normal px-3 py-2 font-montserrat"
          onClick={onEnterAsAdmin}
        >
          Entrar como admin
        </Button>
      )}
    </div>
  );
};
