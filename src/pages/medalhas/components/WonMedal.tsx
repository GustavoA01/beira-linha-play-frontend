import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import type { MedalhaType } from '@/data/types/api';
import { Trash2 } from 'lucide-react';

type WonMedalPropsType = {
  nome: MedalhaType['nome'];
  imagemUrl: MedalhaType['imagemUrl'];
  pontosMin: MedalhaType['pontosMin'];
  canDelete?: boolean;
  onDelete?: () => void;
};

export const WonMedal = ({
  nome,
  imagemUrl,
  pontosMin,
  canDelete = false,
  onDelete,
}: WonMedalPropsType) => {
  const card = (
    <Card className="group cursor-pointer hover:scale-105 hover:shadow-primary transition-all duration-300">
      <CardContent className="space-y-2 select-none flex flex-col items-center">
        <img
          src={imagemUrl}
          alt={nome}
          className="w-20 h-20 sm:w-15 sm:h-15 rounded-full ring-2 ring-green-500 group-hover:ring-primary group-hover:-translate-y-1 transition-all duration-300"
        />
        <p className="text-center text-zinc-800 font-semibold font-montserrat line-clamp-2">
          {nome}
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-muted-foreground text-center text-sm">
          {pontosMin} xp
        </p>
      </CardFooter>
    </Card>
  );

  if (!canDelete || !onDelete) {
    return card;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>{card}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          variant="destructive"
          className="font-montserrat cursor-pointer"
          onClick={onDelete}
        >
          <Trash2 />
          Excluir
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
