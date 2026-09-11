import { Link, useLocation } from 'react-router-dom';
import { LayoutGroup, motion } from 'motion/react';
import { getBottomNavigateButtons } from '@/data/constants';
import { useAuthUser } from '@/providers/UserProvider';
import { cn } from '@/lib/utils';

export const BottomNavigation = () => {
  const { pathname } = useLocation();
  const { isMonitor } = useAuthUser();

  return (
    <LayoutGroup>
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 z-40 flex items-center justify-center gap-6 w-50 left-1/2 -translate-x-1/2 rounded-full bg-white shadow-md py-2 sm:hidden"
      >
        {getBottomNavigateButtons(isMonitor).map((button) => {
          const selected = pathname === button.to;

          return (
            <Link
              key={button.to}
              to={button.to}
              className="relative flex size-11 items-center justify-center"
            >
              {selected && (
                <motion.span
                  layoutId="bottom-nav-ball"
                  className="absolute inset-0 rounded-full bg-primary"
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
        })}
      </motion.nav>
    </LayoutGroup>
  );
};
