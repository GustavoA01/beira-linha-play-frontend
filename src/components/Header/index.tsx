import { Link } from 'react-router-dom';
import { DrawerNavButton } from '@/features/DrawerNavigation/container/DrawerNavButton';
import { HeaderDesktopNav } from './HeaderDesktopNav';
import { LogoutDialog } from '../LogoutDialog';
import { useState } from 'react';
import logoBeiraLinha from '@/assets/logo-beira-linha.png';

export const Header = () => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <header className=" bg-primary text-white">
      <div className="flex justify-between items-center px-4 py-6 container mx-auto sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-20 h-10 shrink-0 overflow-hidden rounded-md bg-white">
            <img
              src={logoBeiraLinha}
              alt="Beira Linha Play"
              className="size-full object-contain"
            />
          </div>
          <h1 className="font-semibold select-none font-montserrat">
            Beira Linha Play
          </h1>
        </Link>

        <nav className="flex items-center gap-2">
          <HeaderDesktopNav onLogout={() => setOpenDialog(true)} />
          <DrawerNavButton />
        </nav>
        <LogoutDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </div>
    </header>
  );
};
