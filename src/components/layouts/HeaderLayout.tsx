import { BottomNavigation } from '@/components/BottomNavigation';
import { Header } from '../Header';
import { Outlet, useLocation } from 'react-router-dom';
import {
  getBottomNavigateButtons,
  isMonitorMapDisabled,
} from '@/data/constants';
import { useAuthUser } from '@/providers/UserProvider';

export const HeaderLayout = () => {
  const { pathname } = useLocation();
  const { isAluno, user } = useAuthUser();
  const bottomNavigateButtons = getBottomNavigateButtons({
    isAluno,
    mapDisabled: isMonitorMapDisabled(user),
  });

  const shouldShowBottomNav = bottomNavigateButtons.some(
    ({ to }) => to === pathname
  );

  return (
    <div className="flex flex-col h-dvh">
      <Header />
      <Outlet />
      {shouldShowBottomNav && <BottomNavigation />}
    </div>
  );
};
