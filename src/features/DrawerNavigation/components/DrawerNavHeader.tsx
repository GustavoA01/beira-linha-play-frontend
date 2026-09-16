import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useAnimateBg } from '@/hooks/useAnimateBg';
import { getInitials } from '@/lib/utils';
import { useAuthUser } from '@/providers/UserProvider';

export const DrawerNavHeader = () => {
  const scope = useAnimateBg();
  const { user, isAluno } = useAuthUser();
  const title = isAluno ? user.apelido : user.nome;
  const subtitle = user.nome;
  const points = isAluno ? user.pontos : null;
  const initials = getInitials(subtitle);

  return (
    <DrawerHeader ref={scope} className="flex flex-col bg-primary gap-4 p-4">
      <Avatar className="size-30">
        <AvatarImage
          alt="Foto de perfil"
          src={isAluno ? user.imagemPerfil : ''}
        />
        <AvatarFallback>{initials || '?'}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col space-y-1">
        <DrawerTitle className="text-white font-fredoka text-lg">
          {title}
        </DrawerTitle>
        {isAluno && (
          <DrawerDescription className="text-white/70 text-sm">
            {subtitle}
          </DrawerDescription>
        )}
        {points !== null && (
          <p className="text-green-400 text-xs font-semibold">{points} xp</p>
        )}
      </div>
    </DrawerHeader>
  );
};
