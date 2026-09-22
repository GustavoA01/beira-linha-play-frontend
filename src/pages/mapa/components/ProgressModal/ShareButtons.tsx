import type { RefObject } from 'react';
import { Loader2Icon, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShareAchievement } from '@/pages/mapa/hooks/useShareAchievement';

type ShareButtonsProps = {
  cardRef: RefObject<HTMLDivElement | null>;
  nome: string;
  level: string;
  points: number;
};

export const ShareButtons = ({
  cardRef,
  nome,
  level,
  points,
}: ShareButtonsProps) => {
  const { sharing, ready, shareNative } = useShareAchievement(
    cardRef,
    nome,
    level,
    points
  );

  const preparing = !ready && !sharing;
  const label = sharing
    ? 'Abrindo…'
    : preparing
      ? 'Preparando…'
      : 'Compartilhar';

  return (
    <div className="mt-4 flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={sharing}
        aria-busy={sharing || preparing}
        onClick={shareNative}
      >
        {sharing || preparing ? (
          <Loader2Icon className="size-4 animate-spin" aria-hidden />
        ) : (
          <Share2 />
        )}
        {label}
      </Button>
    </div>
  );
};
