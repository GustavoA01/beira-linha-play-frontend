import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export type CourseProgressItemType = {
  id: string;
  nome: string;
  progresso: number;
};

type CourseProgressListProps = {
  cursos: CourseProgressItemType[];
  isPending?: boolean;
};

export const CourseProgressList = ({
  cursos,
  isPending = false,
}: CourseProgressListProps) => (
  <div className="mt-6 space-y-3">
    <p className="font-semibold text-xs text-zinc-500">Seus cursos</p>

    {isPending ? (
      <p className="text-sm text-zinc-400">Carregando cursos...</p>
    ) : cursos.length === 0 ? (
      <p className="text-sm text-zinc-400">
        Você ainda não está inscrito em nenhum curso.
      </p>
    ) : (
      <ul className="max-h-48 space-y-3 overflow-y-auto custom-bar pr-1">
        {cursos.map((curso) => (
          <li
            key={curso.id}
            className="rounded-md border border-zinc-200 p-3 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-sm text-zinc-700 min-w-0 truncate">
                {curso.nome}
              </p>
              <p className="text-xs font-bold text-zinc-400 shrink-0">
                {curso.progresso}%
              </p>
            </div>
            <Progress
              value={curso.progresso}
              barColor={
                curso.progresso === 100
                  ? 'bg-linear-to-l from-green-400 to-emerald-700'
                  : 'bg-linear-to-r from-blue-300 to-indigo-600'
              }
            />
            <Button asChild size="sm" className="w-full font-montserrat">
              <Link to={`/cursos/${curso.id}`}>Ver atividades</Link>
            </Button>
          </li>
        ))}
      </ul>
    )}
  </div>
);
