import { CourseSharedHeader } from '@/components/Header/CourseSharedHeader';
import { Card } from '@/components/ui/card';
import { NewButtonFloat } from '@/components/NewButtonFloat';
import { Progress } from '@/components/ui/progress';
import type { CursoType } from '@/data/types/api';

type CourseHeaderProps = {
  curso: CursoType;
  isAluno: boolean;
  isMonitor: boolean;
  progress?: number;
  handleNewModule: () => void;
};

export const CourseHeader = ({
  curso,
  isAluno,
  isMonitor,
  progress = 0,
  handleNewModule,
}: CourseHeaderProps) => (
  <header className={` bg-blue-puc rounded-b-4xl pb-14`}>
    <div className="px-4 pt-4 sm:px-8 sm:pt-8 container mx-auto">
      <CourseSharedHeader />

      <div className="mt-4 mb-2 flex items-center gap-1">
        <h1 className="font-fredoka text-white font-semibold md:text-4xl text-3xl min-w-0">
          {curso.nome}
        </h1>
      </div>

      {isMonitor && (
        <div className="flex justify-between items-center">
          <p className="text-blue-onSurface max-sm:text-sm">
            Código {curso.codigoAcesso}
          </p>
          <NewButtonFloat text="Novo Módulo" onClick={handleNewModule} />
        </div>
      )}

      {isAluno && (
        <Card className="mt-4 p-4 gap-3 bg-blue-900/50 border border-blue-onSurface/30 rounded-lg w-full text-sm">
          <div className="flex justify-between text-center">
            <p className="text-blue-onSurface font-bold text-xs sm:text-sm">
              Progresso do Curso
            </p>
            <p className="text-white text-xs sm:text-sm">{progress}%</p>
          </div>

          <Progress
            value={progress}
            barColor="bg-green-400"
            className="bg-primary-dark"
          />
        </Card>
      )}
    </div>
  </header>
);
