import { Button } from '@/components/ui/button';
import { Lock, LockOpen } from 'lucide-react';

type BlockToggleProps = {
  blocked: boolean;
  label: string;
  onToggle: () => void;
};

export const BlockToggle = ({ blocked, label, onToggle }: BlockToggleProps) => (
  <Button
    type="button"
    variant="ghost"
    size="icon-sm"
    aria-pressed={blocked}
    aria-label={blocked ? `Desbloquear ${label}` : `Bloquear ${label}`}
    title={
      blocked
        ? `Desbloquear ${label === 'módulo' ? 'o módulo' : 'a atividade'}`
        : `Bloquear ${label === 'módulo' ? 'o módulo' : 'a atividade'}`
    }
    className="rounded-full text-zinc-400 hover:text-primary hover:bg-primary/10"
    onClick={(event) => {
      event.stopPropagation();
      onToggle();
    }}
  >
    {blocked ? <Lock /> : <LockOpen />}
  </Button>
);
