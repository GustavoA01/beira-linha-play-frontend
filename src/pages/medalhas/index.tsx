import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MedalsPageSkeleton } from '@/components/PageSkeleton';
import { UnknownMedal } from './components/UnknownMedal';
import { WonMedal } from './components/WonMedal';
import { AddMedalDialog } from './components/AddMedalDialog';
import { motion } from 'framer-motion';
import { useAuthUser } from '@/providers/UserProvider';
import { useDeleteMedal } from './hooks/useMutation';
import { useQuery } from '@tanstack/react-query';
import { listMedals } from '@/services/medalhas';
import { medalKeys } from '@/lib/queryClientKeys';

export const MedalsPage = () => {
  const { isAdmin } = useAuthUser();
  const {
    data: medals = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: medalKeys.all,
    queryFn: listMedals,
  });
  const { mutate: removeMedal } = useDeleteMedal();
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className="container mx-auto mt-8 px-4 sm:px-8 flex flex-col items-center overflow-y-auto custom-bar">
      <h1 className="font-bold font-fredoka text-3xl text-primary-dark">
        Galeria de Medalhas
      </h1>

      <h2 className="font-medium my-4 text-zinc-500">
        Selecione uma medalha alcançada para usar como foto de perfil
      </h2>

      {isAdmin && (
        <Button className="my-4" onClick={() => setOpenDialog(true)}>
          Adicionar medalha
        </Button>
      )}

      {isPending && <MedalsPageSkeleton />}

      {isError && (
        <p className="mt-8 text-sm text-destructive font-montserrat">
          Não foi possível carregar as medalhas.
        </p>
      )}

      {!isPending && !isError && medals.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground font-montserrat">
          Nenhuma medalha no catálogo.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mt-4 pb-6 mx-auto">
        {medals.map((medal, index) => {
          const showAsWon = isAdmin || medal.conquistada;

          return (
            <motion.div
              key={medal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
            >
              {showAsWon ? (
                <WonMedal
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

      <AddMedalDialog open={openDialog} onOpenChange={setOpenDialog} />
    </div>
  );
};
