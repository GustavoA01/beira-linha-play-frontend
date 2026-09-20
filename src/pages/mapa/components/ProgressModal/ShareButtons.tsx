import type { RefObject } from 'react';
import { Share2 } from 'lucide-react';
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
  const { sharing, shareNative } = useShareAchievement(
    cardRef,
    nome,
    level,
    points
  );

  return (
    <div className="mt-4 flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={sharing}
        onClick={shareNative}
      >
        <Share2 />
        Compartilhar
      </Button>
    </div>
  );
};
