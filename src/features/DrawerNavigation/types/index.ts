export type useDrawerItensProps = {
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

export type DrawerNavigationProps = {
  pathName: string;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

export type DrawerSectionProps = {
  title: string;
  pathName: string;
  sectionItens: SectionItemProps[];
};

type SectionItemProps = {
  label: string;
  path: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  onClick: () => void;
  disabled?: boolean;
};
