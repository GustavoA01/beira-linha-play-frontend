import { Link, useLocation } from 'react-router-dom';
import { buttonVariants } from '../ui/button';
import { getHeaderItems } from '@/data/constants';
import { cn } from '@/lib/utils';
import { HeaderUserMenu } from './HeaderUserMenu';
import { useAuthUser } from '@/providers/UserProvider';

type HeaderDesktopNavPropsType = {
  onLogout: () => void;
};

const navLinkClass = (isActive?: boolean) =>
  cn(
    buttonVariants({ variant: 'ghost' }),
    'text-md font-montserrat hover:text-white hover:bg-primary-dark/50 transition-all ease-in',
    isActive ? 'text-white' : 'text-zinc-300'
  );

export const HeaderDesktopNav = ({ onLogout }: HeaderDesktopNavPropsType) => {
  const { pathname } = useLocation();
  const { isAluno } = useAuthUser();

  return (
    <div className="hidden sm:flex items-center gap-2">
      {getHeaderItems(isAluno).map(({ name, path }) => (
        <Link
          to={path}
          key={name + path}
          className={navLinkClass(pathname === path)}
        >
          {name}
        </Link>
      ))}

      <div className="border-l border-white/20 pl-4 ml-2">
        <HeaderUserMenu onLogout={onLogout} />
      </div>
    </div>
  );
};
