import { DrawerNavHeader } from './DrawerNavHeader';
import { DrawerSection } from '../components/DrawerSection';
import { useDrawerItens } from '../hooks/useDrawerItens';
import type { DrawerNavigationProps } from '../types';

export const DrawerNavigation = ({
  pathName,
  setOpenDrawer,
  setOpenDialog,
}: DrawerNavigationProps) => {
  const sections = useDrawerItens({ setOpenDrawer, setOpenDialog });

  return (
    <>
      <DrawerNavHeader />

      <nav className="flex flex-col scrollbar-hidden pb-4 overflow-y-auto pt-4 px-3 space-y-4">
        {sections.map(({ title, items }) => (
          <DrawerSection
            key={title}
            title={title}
            sectionItens={items}
            pathName={pathName}
          />
        ))}
      </nav>
    </>
  );
};
