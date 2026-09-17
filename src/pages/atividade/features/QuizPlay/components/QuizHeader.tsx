import { GoBack } from '@/components/GoBack';
import { Progress } from '@/components/ui/progress';
import { MAX_TENTATIVAS } from '@/data/constants';
import { useParams } from 'react-router-dom';

type QuizHeaderPropsType = {
  title: string;
  progressPercent: number;
  attemptNumber: number;
  onLeave?: () => boolean | Promise<boolean>;
};

export const QuizHeader = ({
  title,
  progressPercent,
  attemptNumber,
  onLeave,
}: QuizHeaderPropsType) => {
  const { cursoId, moduloId } = useParams();

  return (
    <header className="bg-blue-puc text-blue-onSurface">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 pt-4 sm:px-8 sm:pt-8">
        <GoBack
          to={`/cursos/${cursoId}/modulos/${moduloId}`}
          onLeave={onLeave}
        />
        <h1 className="truncate font-semibold text-sm sm:text-base">{title}</h1>
        <p className="shrink-0 text-xs font-semibold">
          {attemptNumber}/{MAX_TENTATIVAS}
        </p>
      </div>
      <div className="container mx-auto px-4 pb-4 pt-3 sm:px-8">
        <Progress
          value={progressPercent}
          barColor="bg-green-400"
          className="h-3 bg-primary-dark"
        />
      </div>
    </header>
  );
};
