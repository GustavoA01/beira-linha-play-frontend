import { CourseSharedHeader } from '@/components/Header/CourseSharedHeader';
import { DescriptionCircle } from '@/components/DescriptionCircle';
import { NewButtonFloat } from '@/components/NewButtonFloat';
import { Progress } from '@/components/ui/progress';
import type { ModuloType } from '@/data/types/api';
import { countModuleActivities, moduleXp } from '@/data/atividades';

type ModuloHeaderProps = {
  modulo: ModuloType;
  setOpenActivityDialog: (open: boolean) => void;
  isAluno: boolean;
  isMonitor: boolean;
};

export const ModuloHeader = ({
  modulo,
  setOpenActivityDialog,
  isAluno,
  isMonitor,
}: ModuloHeaderProps) => {
  const atividadesCount = countModuleActivities(modulo);
  const atividadesLabel = `${atividadesCount} ${atividadesCount === 1 ? 'atividade' : 'atividades'}`;

  return (
    <header className={` bg-blue-puc rounded-b-4xl pb-10`}>
      <div className={`container mx-auto px-4 pt-4 sm:px-8 sm:pt-8`}>
        <CourseSharedHeader />

        <h1 className="font-fredoka text-white font-semibold md:text-4xl text-3xl mt-4 mb-2">
          {modulo.nome}
        </h1>

        <div className="flex justify-between items-center">
          <DescriptionCircle
            className="text-blue-onSurface"
            left={atividadesLabel}
            right={`${moduleXp(modulo)} XP`}
          />

          {isMonitor && (
            <NewButtonFloat
              text="Nova Atividade"
              onClick={() => setOpenActivityDialog(true)}
            />
          )}
        </div>

        {isAluno && (
          <div className="flex items-center gap-2 mt-5 px-2 py-1 border rounded-full bg-blue-900/50 border-blue-onSurface/30">
            <Progress
              value={40}
              barColor="bg-green-300"
              className="bg-primary-dark"
            />
            <p className="text-xs sm:text-sm text-green-300 font-semibold">
              40%
            </p>
          </div>
        )}
      </div>
    </header>
  );
};
