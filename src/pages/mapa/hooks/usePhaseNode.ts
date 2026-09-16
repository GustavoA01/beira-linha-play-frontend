import { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { useAuthUser } from '@/providers/UserProvider';

const LOCKED_GLOW = [
  { color: '#3a6ea5', strength: 0.4 },
  { color: '#0284c7', strength: 1 },
  { color: '#6128a3', strength: 0.2 },
  { color: '#3a6ea5', strength: 0.4 },
] as const;

const UNLOCKED_GLOW = [
  { color: '#4ade80', strength: 0.45 },
  { color: '#a3e635', strength: 1 },
  { color: '#86efac', strength: 0.55 },
  { color: '#4ade80', strength: 0.45 },
] as const;

const hexAlpha = (value: number) =>
  Math.round(Math.min(255, Math.max(0, value)))
    .toString(16)
    .padStart(2, '0');

const toGlowShadow = (color: string, strength: number) => {
  const blur = 6 + strength * 10;
  const spread = strength * 2;
  const offset = 3 + strength * 4;
  const core = hexAlpha(36 + strength * 40);
  const drop = hexAlpha(20 + strength * 28);
  return `0 0 ${blur}px ${spread}px ${color}${core}, 0 ${offset}px ${blur + 4}px ${color}${drop}`;
};

export const usePhaseNode = (minPoints: number) => {
  const { user, isAluno: isInteractive } = useAuthUser();
  const [openDialog, setOpenDialog] = useState(false);

  const points = isInteractive ? user.pontos : 0;
  const isLocked = isInteractive && points < minPoints;
  const Icon = isLocked || !isInteractive ? Star : Check;
  const glow = isLocked || !isInteractive ? LOCKED_GLOW : UNLOCKED_GLOW;
  const glowColors = glow.map((stop) => stop.color);
  const glowShadows = glow.map((stop) =>
    toGlowShadow(stop.color, stop.strength)
  );
  const glowOpacities = glow.map((stop) => 0.12 + stop.strength * 0.22);
  const glowScales = glow.map((stop) => 0.78 + stop.strength * 0.32);
  const iconClassName =
    isLocked || !isInteractive ? 'text-white' : 'text-green-900';

  return {
    openDialog,
    setOpenDialog,
    isInteractive,
    points,
    isLocked,
    glowColors,
    glowShadows,
    glowOpacities,
    glowScales,
    Icon,
    iconClassName,
  };
};
