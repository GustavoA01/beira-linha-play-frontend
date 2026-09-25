import { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { useAuthUser } from '@/providers/UserProvider';
import { LOCKED_GLOW, UNLOCKED_GLOW } from '../constants/nodesPhases';
import { toGlowShadow } from '../utils';

export const usePhaseNode = (minPoints: number) => {
  const { user, isAluno } = useAuthUser();
  const [openDialog, setOpenDialog] = useState(false);

  const points = isAluno ? user.pontos : 0;
  const isLocked = isAluno && points < minPoints;
  const Icon = isLocked || !isAluno ? Star : Check;
  const glow = isLocked || !isAluno ? LOCKED_GLOW : UNLOCKED_GLOW;
  const glowColors = glow.map((stop) => stop.color);
  const glowShadows = glow.map((stop) =>
    toGlowShadow(stop.color, stop.strength)
  );
  const glowOpacities = glow.map((stop) => 0.12 + stop.strength * 0.22);
  const glowScales = glow.map((stop) => 0.78 + stop.strength * 0.32);
  const iconClassName = isLocked || !isAluno ? 'text-white' : 'text-green-900';

  return {
    openDialog,
    setOpenDialog,
    showProgress: isAluno,
    studentName: isAluno ? user.nome : '',
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
