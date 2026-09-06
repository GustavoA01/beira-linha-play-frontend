import { Button } from '@/components/ui/button';
import type { UsuarioType } from '@/data/types/api';
import { Plus, UserPlus } from 'lucide-react';

type CoursesHeaderProps = {
  role: UsuarioType['tipo'];
  isAdmin: boolean;
  onAddCourse: () => void;
  onAddAdmin: () => void;
};

const labels = {
  ADMIN: 'Selecione o curso para editar ou acompanhar',
  MONITOR: 'Selecione a disciplina que você monitora para adicionar atividades',
  ALUNO: 'Selecione o curso que você deseja acessar',
};

export const CoursesHeader = ({
  role,
  isAdmin,
  onAddCourse,
  onAddAdmin,
}: CoursesHeaderProps) => (
  <header className="flex justify-between items-center gap-4">
    <div>
      <h1 className="font-fredoka text-primary-dark font-semibold md:text-2xl text-xl">
        Cursos
      </h1>
      <p className="text-zinc-500 text-sm sm:text-base select-none">
        {labels[role]}
      </p>
    </div>

    {isAdmin && (
      <div className="flex shrink-0 items-center gap-2">
        <Button className="max-sm:w-10" onClick={onAddAdmin}>
          <UserPlus />
          <p className="max-sm:hidden">Adicionar Admin</p>
        </Button>
        <Button className="max-sm:w-10" onClick={onAddCourse}>
          <Plus />
          <p className="max-sm:hidden">Adicionar Curso</p>
        </Button>
      </div>
    )}
  </header>
);
