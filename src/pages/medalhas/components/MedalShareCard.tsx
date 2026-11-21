import { forwardRef } from 'react';
import { DESAFIO_PHRASE } from '@/pages/mapa/utils';

type MedalShareCardProps = {
  alunoNome: string;
  medalhaNome: string;
  imagemUrl: string;
  code: string;
};

const EXPORT_SIZE = 1080;

export const MedalShareCard = forwardRef<HTMLDivElement, MedalShareCardProps>(
  ({ alunoNome, medalhaNome, imagemUrl, code }, ref) => (
    <div
      ref={ref}
      style={{
        width: EXPORT_SIZE,
        height: EXPORT_SIZE,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 64,
        color: '#ffffff',
        textAlign: 'center',
        background:
          'linear-gradient(to bottom right, #047857, #16a34a, #84cc16)',
        fontFamily: 'Montserrat, Fredoka, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <img
          src="/logo.png"
          alt=""
          width={140}
          height={140}
          style={{
            width: 140,
            height: 140,
            objectFit: 'contain',
            background: '#ffffff',
            borderRadius: 24,
            padding: 12,
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Beira Linha Play
        </p>
      </div>
      <img
        src={imagemUrl}
        alt=""
        crossOrigin="anonymous"
        width={280}
        height={280}
        style={{
          width: 280,
          height: 280,
          objectFit: 'cover',
          borderRadius: '50%',
          background: '#ffffff',
        }}
      />
      <div>
        <p
          style={{
            margin: 0,
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          {medalhaNome}
        </p>
        <p
          style={{
            margin: '20px 0 0',
            fontSize: 36,
            fontWeight: 600,
            fontFamily: 'Fredoka, sans-serif',
          }}
        >
          {alunoNome}
        </p>
      </div>
      <div
        style={{
          width: '100%',
          boxSizing: 'border-box',
          background: '#fef9c3',
          color: '#14532d',
          borderRadius: 24,
          padding: '28px 36px',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 30,
            fontWeight: 800,
            lineHeight: 1.35,
          }}
        >
          {DESAFIO_PHRASE}
        </p>
        <p
          style={{
            margin: '20px 0 0',
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: '0.12em',
            fontFamily: 'Fredoka, sans-serif',
          }}
        >
          Código {code}
        </p>
      </div>
    </div>
  )
);

MedalShareCard.displayName = 'MedalShareCard';
