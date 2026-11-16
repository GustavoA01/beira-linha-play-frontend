import { GoBack } from '@/components/GoBack';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

type ActivityBlockedProps = {
  title: string;
};

export const ActivityBlocked = ({ title }: ActivityBlockedProps) => {
  const navigate = useNavigate();
  const { cursoId, moduloId } = useParams();
  const modulePath = `/cursos/${cursoId}/modulos/${moduloId}`;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-zinc-50">
      <header className="bg-blue-puc px-4 pt-4 pb-8 text-blue-onSurface sm:px-8 sm:pt-8">
        <div className="container mx-auto flex items-center justify-between">
          <GoBack to={modulePath} />
          <h1 className="truncate font-semibold">{title}</h1>
          <span className="w-16" />
        </div>
      </header>

      <div className="container mx-auto flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <span title="Atividade indisponível para realização">
          <Lock className="size-10 text-zinc-400" />
        </span>
        <h2 className="font-fredoka text-3xl font-semibold text-primary-dark">
          Atividade bloqueada
        </h2>
        <p className="font-montserrat text-zinc-600">
          O monitor bloqueou esta atividade. Ela não pode ser realizada agora.
        </p>
        <Button
          size="lg"
          className="mt-2 h-12 font-bold"
          onClick={() => navigate(modulePath, { replace: true })}
        >
          Voltar ao módulo
        </Button>
      </div>
    </div>
  );
};
