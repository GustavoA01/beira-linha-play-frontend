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
    <div className="flex h-dvh flex-col">
      <Header />
      <div className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </div>
      {shouldShowBottomNav && <BottomNavigation />}
    </div>
  );
};
