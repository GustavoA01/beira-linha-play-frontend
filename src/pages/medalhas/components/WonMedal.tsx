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
        'group h-full gap-2 py-4 transition-all duration-300',
        disabled
          ? 'pointer-events-none cursor-wait opacity-50 grayscale'
          : 'cursor-pointer hover:scale-105 hover:shadow-primary'
      )}
    >
      <CardContent className="flex flex-1 flex-col items-center gap-2 select-none px-3">
        <img
          src={imagemUrl}
          alt={nome}
          className="size-20 shrink-0 rounded-full ring-2 ring-green-500 transition-all duration-300 group-hover:-translate-y-1 group-hover:ring-primary sm:size-15"
        />
        <p className="line-clamp-1 min-h-6 w-full text-center font-montserrat font-semibold text-zinc-800">
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
