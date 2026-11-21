import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useShareAchievement } from '@/pages/mapa/hooks/useShareAchievement';
import { achievementCode } from '@/pages/mapa/utils';
import type { MedalhaType } from '@/data/types/api';
import { MedalShareCard } from './MedalShareCard';
import { WonMedal } from './WonMedal';

const FILE_NAME = 'medalha-beira-linha-play.png';

type AlunoWonMedalProps = {
  medalha: Pick<MedalhaType, 'id' | 'nome' | 'imagemUrl' | 'pontosMin'>;
  alunoId: string;
  alunoNome: string;
  disabled?: boolean;
  onSelect: () => void;
};

const medalShareCaption = (alunoNome: string, medalhaNome: string) =>
  `${alunoNome} conquistou a medalha ${medalhaNome} no Beira Linha Play.`;

export const AlunoWonMedal = ({
  medalha,
  alunoId,
  alunoNome,
  disabled,
  onSelect,
}: AlunoWonMedalProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const code = achievementCode(alunoId, medalha.id);
  const { sharing, ready, shareNative } = useShareAchievement(
    cardRef,
    medalShareCaption(alunoNome, medalha.nome),
    FILE_NAME
  );

  const exportCard =
    typeof document !== 'undefined'
      ? createPortal(
          <div
            aria-hidden
            style={{
              position: 'fixed',
              left: -1200,
              top: 0,
              width: 1080,
              height: 1080,
              pointerEvents: 'none',
            }}
          >
            <MedalShareCard
              ref={cardRef}
              alunoNome={alunoNome}
              medalhaNome={medalha.nome}
              imagemUrl={medalha.imagemUrl}
              code={code}
            />
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <WonMedal
        nome={medalha.nome}
        imagemUrl={medalha.imagemUrl}
        pontosMin={medalha.pontosMin}
        disabled={disabled}
        selectImage={onSelect}
        onShare={shareNative}
        sharing={sharing}
        preparing={!ready && !sharing}
      />
      {exportCard}
    </>
  );
};
