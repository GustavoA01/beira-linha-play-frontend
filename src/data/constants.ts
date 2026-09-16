import { Map as MapIcon, NotebookPen, Trophy } from 'lucide-react';

export const MAX_TENTATIVAS = 2;

export const mapPath = (isAluno: boolean) => (isAluno ? '/' : '/mapa');

export const getHeaderItems = (isAluno: boolean) =>
  [
    { name: 'Cursos', path: '/cursos' },
    { name: 'Mapa', path: mapPath(isAluno) },
    { name: 'Medalhas', path: '/medalhas' },
  ] as const;

export const getBottomNavigateButtons = (isAluno: boolean) =>
  [
    {
      icon: NotebookPen,
      to: '/cursos',
    },
    {
      icon: MapIcon,
      to: mapPath(isAluno),
    },
    {
      icon: Trophy,
      to: '/rankings',
    },
  ] as const;
