import { Button } from '@/components/ui/button';
import { MedalsPageSkeleton } from '@/components/PageSkeleton';
import { Spinner } from '@/components/ui/spinner';
import { UnknownMedal } from './components/UnknownMedal';
import { WonMedal } from './components/WonMedal';
import { AddMedalDialog } from './components/AddMedalDialog';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Navigate } from 'react-router-dom';
import { useAuthUser } from '@/providers/UserProvider';
import { useState } from 'react';
import {
  useDeleteMedal,
  useGetMedals,
  useSelectMedal,
} from './hooks/useMutation';

export const MedalsPage = () => {
  const { isMonitor, isAdmin, isAluno } = useAuthUser();
  const {
    data: medals = [],
    isPending: isGetingMedals,
    isError,
  } = useGetMedals();
  const { mutate: selectMedal, isPending: isSelectingMedal } = useSelectMedal();
  const { mutate: removeMedal } = useDeleteMedal();
  const [openDialog, setOpenDialog] = useState(false);

  if (isMonitor) return <Navigate to="/cursos" replace />;

  return (
    <div className="container mx-auto flex min-h-0 flex-1 flex-col items-center overflow-y-auto custom-bar px-4 pb-8 pt-6 sm:px-8">
      <h1 className="font-fredoka text-3xl font-bold text-primary-dark">
        Galeria de Medalhas
      </h1>

      {isAluno ? (
        <h2 className="my-3 text-center font-medium text-zinc-500">
          Selecione uma medalha alcançada para usar como foto de perfil
        </h2>
      ) : isAdmin ? (
        <>
          <h2 className="my-3 text-center font-medium text-zinc-500">
            Use o botão direito do mouse para deletar uma medalha
          </h2>
          <Button className="mb-2" onClick={() => setOpenDialog(true)}>
            Adicionar medalha
          </Button>
        </>
      ) : null}

      {isGetingMedals && <MedalsPageSkeleton />}

      {isError && (
        <p className="mt-8 font-montserrat text-sm text-destructive">
          Não foi possível carregar as medalhas.
        </p>
      )}

      {!isGetingMedals && !isError && medals.length === 0 && (
        <p className="mt-8 font-montserrat text-sm text-muted-foreground">
          Nenhuma medalha no catálogo.
        </p>
      )}

      <div className="relative w-full">
        {isSelectingMedal && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-lg bg-white/60 backdrop-blur-[1px]">
            <Spinner className="size-6 text-primary" />
            <p className="font-montserrat text-sm text-zinc-600">
              Atualizando foto de perfil...
            </p>
          </div>
        )}

        <div
          className={cn(
            'mx-auto mt-4 grid grid-cols-2 items-stretch gap-4 pb-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6',
            isSelectingMedal && 'pointer-events-none select-none'
          )}
          aria-busy={isSelectingMedal || undefined}
        >
          {medals.map((medal, index) => {
            const showAsWon = isAdmin || medal.conquistada;

            return (
              <motion.div
                key={medal.id}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
              >
                {showAsWon ? (
                  <WonMedal
                    selectImage={() => selectMedal(medal.id)}
                    disabled={isSelectingMedal}
                    nome={medal.nome}
                    imagemUrl={medal.imagemUrl}
                    pontosMin={medal.pontosMin}
                    canDelete={isAdmin}
                    onDelete={() =>
                      removeMedal({ id: medal.id, imagemUrl: medal.imagemUrl })
                    }
                  />
                ) : (
                  <UnknownMedal minPoints={medal.pontosMin} />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <AddMedalDialog open={openDialog} onOpenChange={setOpenDialog} />
    </div>
  );
};
