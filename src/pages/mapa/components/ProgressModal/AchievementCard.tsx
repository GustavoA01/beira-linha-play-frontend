import { forwardRef } from 'react';

type AchievementCardProps = {
  nome: string;
  level: string;
  points: number;
  minPoints: number;
  variant?: 'preview' | 'export';
};

const EXPORT_SIZE = 1080;

export const AchievementCard = forwardRef<HTMLDivElement, AchievementCardProps>(
  ({ nome, level, points, minPoints, variant = 'preview' }, ref) => {
    if (variant === 'export') {
      return (
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
            padding: 96,
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
              width={160}
              height={160}
              style={{
                width: 160,
                height: 160,
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
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 56,
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              {nome}
            </p>
            <p
              style={{
                margin: '24px 0 0',
                fontSize: 48,
                fontWeight: 600,
                fontFamily: 'Fredoka, sans-serif',
              }}
            >
              Concluiu o nível {level}
            </p>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 500,
              fontFamily: 'Fredoka, sans-serif',
            }}
          >
            {points} / {minPoints} XP
          </p>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="mx-auto mt-4 aspect-square w-full max-w-[280px] rounded-xl bg-linear-to-br from-emerald-700 via-green-600 to-lime-500 p-5 text-white shadow-lg"
      >
        <div className="flex h-full flex-col items-center justify-between text-center">
          <div className="flex flex-col items-center gap-2">
            <img
              src="/logo.png"
              alt=""
              className="size-14 rounded-lg bg-white object-contain p-1"
            />
            <p className="font-montserrat text-xs font-bold tracking-wide uppercase">
              Beira Linha Play
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-montserrat text-lg font-bold leading-tight">
              {nome}
            </p>
            <p className="font-fredoka text-xl font-semibold">
              Concluiu o nível {level}
            </p>
          </div>

          <p className="font-fredoka text-sm font-medium">
            {points} / {minPoints} XP
          </p>
        </div>
      </div>
    );
  }
);

AchievementCard.displayName = 'AchievementCard';
