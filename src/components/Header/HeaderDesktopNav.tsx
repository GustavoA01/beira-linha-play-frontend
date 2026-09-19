import { Link, useLocation } from 'react-router-dom';
import { buttonVariants } from '../ui/button';
import { getHeaderItems, isMonitorMapDisabled } from '@/data/constants';
import { cn } from '@/lib/utils';
import { HeaderUserMenu } from './HeaderUserMenu';
import { useAuthUser } from '@/providers/UserProvider';

type HeaderDesktopNavPropsType = {
  onLogout: () => void;
};

const navLinkClass = (isActive?: boolean, disabled?: boolean) =>
  cn(
    buttonVariants({ variant: 'ghost' }),
    'text-md font-montserrat hover:text-white hover:bg-primary-dark/50 transition-all ease-in',
    isActive ? 'text-white' : 'text-zinc-300',
    disabled && 'pointer-events-none opacity-50'
  );

export const HeaderDesktopNav = ({ onLogout }: HeaderDesktopNavPropsType) => {
  const { pathname } = useLocation();
  const { isAluno, isAdmin, user } = useAuthUser();
  const mapDisabled = isMonitorMapDisabled(user);

  return (
    <div className="hidden sm:flex items-center gap-2">
      {getHeaderItems({
        isAluno,
        showMedalhas: isAluno || isAdmin,
        mapDisabled,
      }).map(({ name, path, disabled }) =>
        disabled ? (
          <span
            key={name + path}
            aria-disabled="true"
            className={navLinkClass(false, true)}
          >
            {name}
          </span>
        ) : (
          <Link
            to={path}
            key={name + path}
            className={navLinkClass(pathname === path)}
          >
            {name}
          </Link>
        )
      )}

      <div className="border-l border-white/20 pl-4 ml-2">
        <HeaderUserMenu onLogout={onLogout} />
      </div>
    </div>
  );
};
