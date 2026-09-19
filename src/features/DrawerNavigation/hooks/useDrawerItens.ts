import {
  BookOpen,
  CircleStar,
  LogOut,
  Map as MapIcon,
  Trophy,
  UserPen,
} from 'lucide-react';
import { mapPath, isMonitorMapDisabled } from '@/data/constants';
import { useAuthUser } from '@/providers/UserProvider';
import type { useDrawerItensProps } from '../types';

export const useDrawerItens = ({
  setOpenDrawer,
  setOpenDialog,
}: useDrawerItensProps) => {
  const { isAluno, isAdmin, user } = useAuthUser();
  const mapDisabled = isMonitorMapDisabled(user);

  const headerAcademicItems = [
    {
      label: 'Cursos',
      path: '/cursos',
      icon: BookOpen,
      onClick: () => setOpenDrawer(false),
    },
  ];

  const headerConquestItems = [
    {
      label: 'Mapa',
      path: mapPath(isAluno),
      icon: MapIcon,
      disabled: mapDisabled,
      onClick: () => {
        if (mapDisabled) return;
        setOpenDrawer(false);
      },
    },
    {
      label: 'Rankings',
      path: '/rankings',
      icon: Trophy,
      onClick: () => setOpenDrawer(false),
    },
    ...(isAluno || isAdmin
      ? [
          {
            label: 'Medalhas',
            path: '/medalhas',
            icon: CircleStar,
            onClick: () => setOpenDrawer(false),
          },
        ]
      : []),
  ];

  const configurationItems = [
    {
      label: 'Editar conta',
      path: '/',
      icon: UserPen,
      onClick: () => setOpenDrawer(false),
    },
    {
      label: 'Sair',
      path: '/',
      icon: LogOut,
      onClick: () => {
        setOpenDrawer(false);
        setOpenDialog(true);
      },
    },
  ];

  const sections = [
    {
      title: 'ACADÊMICO',
      items: headerAcademicItems,
    },
    {
      title: 'CONQUISTAS',
      items: headerConquestItems,
    },
    {
      title: 'CONFIGURAÇÕES',
      items: configurationItems,
    },
  ];

  return sections;
};
