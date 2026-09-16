import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { getInitials } from '@/lib/utils';
import { useUserProvider } from '@/providers/UserProvider';

type HeaderUserMenuPropsType = {
  onLogout: () => void;
};

export const HeaderUserMenu = ({ onLogout }: HeaderUserMenuPropsType) => {
  const auth = useUserProvider();
  if (!auth.user) return null;

  const greetingName = auth.isAluno ? auth.user.apelido : auth.user.nome;
  const initials = getInitials(auth.user.nome) || '?';

  const src =
    auth.isAluno && auth.user.imagemPerfil ? auth.user.imagemPerfil : '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-2 rounded-md py-1 pl-1 pr-2 outline-none font-montserrat hover:bg-primary-dark/50 transition-all ease-in">
        <Avatar className="size-10 ring-2 ring-white/90">
          <AvatarImage src={src} alt="Foto de perfil" />
          <AvatarFallback className="bg-white text-primary text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <p>Olá, {greetingName}</p>
        <ChevronDown
          size={16}
          className="transition-transform duration-200 group-data-popup-open:rotate-180"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="min-w-40">
        <DropdownMenuItem
          className="font-montserrat cursor-pointer"
          render={<Link to="/editar-conta" />}
        >
          <Pencil size={16} />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          variant="destructive"
          className="font-montserrat cursor-pointer"
        >
          <LogOut size={16} />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
