import { Map as MapIcon, Medal, NotebookPen, Trophy } from 'lucide-react';
import type { UsuarioType } from '@/data/types/api';

type NavOptions = {
  isAluno: boolean;
  showMedalhas: boolean;
  showImportacao?: boolean;
  showConfiguracao?: boolean;
  mapDisabled?: boolean;
};

export const MAX_TENTATIVAS = 2;

export const mapPath = (isAluno: boolean) => (isAluno ? '/' : '/mapa');

export const isMonitorMapDisabled = (user: UsuarioType | null) =>
  user?.tipo === 'MONITOR' && user.cursoIds.length === 0;

export const getHeaderItems = ({
  isAluno,
  showMedalhas,
  showImportacao = false,
  showConfiguracao = false,
  mapDisabled = false,
}: NavOptions) => {
  const items = [
    { name: 'Cursos', path: '/cursos', disabled: false },
    { name: 'Mapa', path: mapPath(isAluno), disabled: mapDisabled },
  ];

  if (showMedalhas) {
    items.push({ name: 'Medalhas', path: '/medalhas', disabled: false });
  }

  if (showImportacao) {
    items.push({ name: 'Importar', path: '/importacao', disabled: false });
  }

  if (showConfiguracao) {
    items.push({
      name: 'Configurações',
      path: '/configuracoes',
      disabled: false,
    });
  }

  return items;
};

export const getBottomNavigateButtons = ({
  isAluno,
  showMedalhas = false,
  mapDisabled = false,
}: Pick<NavOptions, 'isAluno' | 'showMedalhas' | 'mapDisabled'>) => {
  const items = [
    {
      icon: NotebookPen,
      to: '/cursos',
      disabled: false,
    },
    {
      icon: MapIcon,
      to: mapPath(isAluno),
      disabled: Boolean(mapDisabled),
    },
    {
      icon: Trophy,
      to: '/rankings',
      disabled: false,
    },
  ];

  if (showMedalhas) {
    items.push({ icon: Medal, to: '/medalhas', disabled: false });
  }

  return items;
};
