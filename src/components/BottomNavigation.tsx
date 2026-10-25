import { Link, useLocation } from 'react-router-dom';
import { LayoutGroup, motion } from 'motion/react';
import {
  getBottomNavigateButtons,
  isMonitorMapDisabled,
} from '@/data/constants';
import { useAuthUser } from '@/providers/UserProvider';
import { cn } from '@/lib/utils';

export const BottomNavigation = () => {
  const { pathname } = useLocation();
  const { isAluno, isAdmin, user } = useAuthUser();
  const mapDisabled = isMonitorMapDisabled(user);
  const showMedalhas = isAluno || isAdmin;

  return (
    <LayoutGroup>
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center justify-center gap-2 overflow-visible rounded-full bg-white px-2 py-1.5 shadow-md sm:hidden"
      >
        {getBottomNavigateButtons({ isAluno, showMedalhas, mapDisabled }).map(
          (button) => {
            const selected = pathname === button.to;

            if (button.disabled) {
              return (
                <span
                  key={button.to}
                  aria-disabled="true"
                  className="relative flex size-11 shrink-0 items-center justify-center opacity-40"
                >
                  <button.icon className="relative z-10 text-zinc-400" />
                </span>
              );
            }

            return (
              <Link
                key={button.to}
                to={button.to}
                className="relative flex size-11 shrink-0 items-center justify-center"
              >
                {selected && (
                  <motion.span
                    layoutId="bottom-nav-ball"
                    className="absolute inset-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <button.icon
                  className={cn(
                    'relative z-10 transition-colors duration-200',
                    selected ? 'text-white' : 'text-zinc-400'
                  )}
                />
              </Link>
            );
          }
        )}
      </motion.nav>
    </LayoutGroup>
  );
};
