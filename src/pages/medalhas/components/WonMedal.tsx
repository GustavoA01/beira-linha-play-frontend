import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import type { MedalhaType } from '@/data/types/api';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

type WonMedalPropsType = {
  nome: MedalhaType['nome'];
  imagemUrl: MedalhaType['imagemUrl'];
  pontosMin: MedalhaType['pontosMin'];
  canDelete?: boolean;
  disabled?: boolean;
  onDelete?: () => void;
  selectImage?: () => void;
};

export const WonMedal = ({
  nome,
  imagemUrl,
  pontosMin,
  canDelete = false,
  disabled = false,
  onDelete,
  selectImage,
}: WonMedalPropsType) => {
  const card = (
    <Card
      onClick={disabled ? undefined : selectImage}
      aria-disabled={disabled || undefined}
      className={cn(
        'group h-full gap-2 py-3 transition-all duration-300 sm:py-4',
        disabled
          ? 'pointer-events-none cursor-wait opacity-50 grayscale'
          : 'cursor-pointer sm:hover:scale-105 sm:hover:shadow-primary'
      )}
    >
      <CardContent className="flex flex-1 flex-col items-center gap-2 select-none px-2 sm:px-3">
        <img
          src={imagemUrl}
          alt={nome}
          className="size-16 shrink-0 rounded-full ring-2 ring-green-500 transition-all duration-300 sm:size-20 sm:group-hover:-translate-y-1 sm:group-hover:ring-primary"
        />
        <p className="line-clamp-2 min-h-10 w-full text-center font-montserrat text-sm font-semibold text-zinc-800 sm:line-clamp-1 sm:min-h-6 sm:text-base">
          {nome}
        </p>
      </CardContent>
      <CardFooter className="justify-center px-3 pt-0">
        <p className="text-center text-sm text-muted-foreground">
          {pontosMin} xp
        </p>
      </CardFooter>
    </Card>
  );

  if (!canDelete || !onDelete) return card;

  return (
    <ContextMenu>
      <ContextMenuTrigger className="block h-full">{card}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          variant="destructive"
          className="cursor-pointer font-montserrat"
          onClick={onDelete}
        >
          <Trash2 />
          Excluir
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
