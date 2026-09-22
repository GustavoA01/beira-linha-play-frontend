import { useState, type SyntheticEvent } from 'react';
import { Card } from '@/components/ui/card';
import { DescriptionCircle } from '@/components/DescriptionCircle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { CursoType } from '@/data/types/api';
import { countCourseActivities } from '@/data/atividades';
import { cn } from '@/lib/utils';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { DeleteCourseDialog } from './DeleteCourseDialog';

type CourseCardPropsType = {
  curso: CursoType;
  monitorNome: string;
  locked?: boolean;
  onClick?: () => void;
  codCurso: string;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export const CourseCard = ({
  curso,
  monitorNome,
  locked = false,
  onClick,
  codCurso,
  canDelete = false,
  onEdit,
  onDelete,
}: CourseCardPropsType) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const atividadesCount = countCourseActivities(curso);
  const modulosLabel = `${curso.modulos.length} ${curso.modulos.length === 1 ? 'módulo' : 'módulos'}`;
  const atividadesLabel = `${atividadesCount} Ativ.`;
  const stopCardClick = (event: SyntheticEvent) => {
    event.stopPropagation();
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        'group flex flex-col gap-4 p-4 w-full md:max-w-68 shadow-md transition-all ease-in',
        onClick &&
          'cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-blue-300',
        locked && 'opacity-50'
      )}
    >
      <header>
        <div className="flex items-start justify-between gap-2">
          <h1 className="font-bold text-lg group-hover:text-primary min-w-0 line-clamp-1">
            {curso.nome}
          </h1>

          {canDelete && (onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Ações do curso"
                className="shrink-0 rounded-md p-1 outline-none hover:bg-accent"
                onClick={stopCardClick}
                onPointerDown={stopCardClick}
              >
                <EllipsisVertical className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onClick={stopCardClick}
                onPointerDown={stopCardClick}
              >
                {onEdit && (
                  <DropdownMenuItem
                    className="font-montserrat cursor-pointer"
                    onClick={onEdit}
                  >
                    <Pencil />
                    Editar
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    variant="destructive"
                    className="font-montserrat cursor-pointer"
                    onClick={() => setConfirmOpen(true)}
                  >
                    <Trash2 />
                    Excluir
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <p className="text-sm text-zinc-500 mt-1 truncate">{monitorNome}</p>
        {codCurso && (
          <p className="text-xs text-zinc-400 truncate">{codCurso}</p>
        )}

        <DescriptionCircle
          className="mt-3"
          left={modulosLabel}
          right={atividadesLabel}
        />
      </header>

      {canDelete && onDelete && (
        <DeleteCourseDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          courseName={curso.nome}
          onConfirm={() => {
            onDelete();
            setConfirmOpen(false);
          }}
        />
      )}
    </Card>
  );
};
