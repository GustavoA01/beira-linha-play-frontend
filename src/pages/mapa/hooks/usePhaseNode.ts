import { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { useAuthUser } from '@/providers/UserProvider';

export const usePhaseNode = (minPoints: number) => {
  const { user, isAluno: isInteractive } = useAuthUser();
  const [openDialog, setOpenDialog] = useState(false);

  const points = isInteractive ? user.pontos : 0;
  const isLocked = isInteractive && points < minPoints;
  const Icon = isLocked || !isInteractive ? Star : Check;
  const glowColors =
    isLocked || !isInteractive
      ? ['#3a6ea5', '#0284c7', '#6128a3', '#3a6ea5']
      : ['#4ade80', '#a3e635', '#86efac', '#4ade80'];
  const iconClassName =
    isLocked || !isInteractive ? 'text-white' : 'text-green-900';

  return {
    openDialog,
    setOpenDialog,
    isInteractive,
    points,
    isLocked,
    glowColors,
    Icon,
    iconClassName,
  };
};
