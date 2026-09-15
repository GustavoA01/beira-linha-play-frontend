import { GoBack } from '@/components/GoBack';
import { Button } from '@/components/ui/button';
import type { AtividadeType } from '@/data/types/api';
import { useNavigate, useParams } from 'react-router-dom';

type ActivityConcludedPropsType = {
  activity: AtividadeType;
  bestScore: number;
  totalXp: number;
};

export const ActivityConcluded = ({
  activity,
  bestScore,
  totalXp,
}: ActivityConcludedPropsType) => {
  const navigate = useNavigate();
  const { cursoId, moduloId } = useParams();
  const modulePath = `/cursos/${cursoId}/modulos/${moduloId}`;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-zinc-50">
      <header className="bg-blue-puc px-4 pt-4 pb-8 text-blue-onSurface sm:px-8 sm:pt-8">
        <div className="container mx-auto flex items-center justify-between">
          <GoBack to={modulePath} />
          <h1 className="truncate font-semibold">{activity.titulo}</h1>
          <span className="w-16" />
        </div>
      </header>

      <div className="container mx-auto flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="font-fredoka text-3xl font-semibold text-primary-dark">
          Atividade concluída
        </h2>
        <p className="font-montserrat text-zinc-600">
          Sua melhor pontuação: {bestScore}/{totalXp} pts
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
