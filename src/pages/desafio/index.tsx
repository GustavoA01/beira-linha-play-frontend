import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { confirmarEntradaDesafio } from '@/data/desafioEntrada';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { toastError } from '@/lib/utils';
import { useAuthUser } from '@/providers/UserProvider';
import { enrollCourse, listCourses } from '@/services/cursos';
import { escolherCursoPontuado } from '@/services/usuarios';
import { ApiError } from '@/services/api';
import { CodeDialog } from '@/pages/cursos/components/CodeDialog';

export const DesafioPage = () => {
  const { user, setUser } = useAuthUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const aluno = user?.tipo === 'ALUNO' ? user : null;
  const [cursoId, setCursoId] = useState(aluno?.cursoPontuadoId ?? '');
  const [openCode, setOpenCode] = useState(false);

  const { data: courses = [], isPending } = useQuery({
    queryKey: queryClientKeys.courseKeys.all,
    queryFn: listCourses,
  });

  const inscritos = courses.filter((course) =>
    aluno?.cursoIds.includes(course.id)
  );

  const { mutate, isPending: isSaving } = useMutation({
    mutationFn: escolherCursoPontuado,
    onSuccess: (saved) => {
      setUser(saved);
      confirmarEntradaDesafio();
      navigate('/', { replace: true });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível escolher o curso');
    },
  });

  const entrarComCodigo = async (code: string) => {
    try {
      const curso = await enrollCourse({ codigoAcesso: code });
      if (aluno) {
        setUser({
          ...aluno,
          cursoIds: aluno.cursoIds.includes(curso.id)
            ? aluno.cursoIds
            : [...aluno.cursoIds, curso.id],
        });
      }
      setCursoId(curso.id);
      await queryClient.invalidateQueries({
        queryKey: queryClientKeys.courseKeys.all,
      });
      toast.add({ type: 'success', title: 'Inscrição feita' });
    } catch (error) {
      return error instanceof ApiError &&
        error.message !== 'Não foi possível completar a operação'
        ? error.message
        : 'Código inválido. Confira e tente de novo.';
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-zinc-50 px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="font-fredoka text-2xl font-semibold text-primary-dark">
          Desafio Beira Linha Play
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Escolha o curso em que você vai pontuar. Os outros cursos continuam
          liberados, mas não entram no seu XP.
        </p>

        {isPending ? (
          <div className="mt-8 flex justify-center">
            <Spinner />
          </div>
        ) : inscritos.length === 0 ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-zinc-600">
              Você ainda não está em nenhum curso. Entre com o código que o
              monitor passou para poder escolher onde pontuar.
            </p>
            <Button type="button" onClick={() => setOpenCode(true)}>
              Entrar com código
            </Button>
          </div>
        ) : (
          <form
            className="mt-6 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (!cursoId) return;
              mutate(cursoId);
            }}
          >
            <fieldset className="space-y-2">
              <legend className="sr-only">Curso em que você pontua</legend>
              {inscritos.map((course) => (
                <label
                  key={course.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 ${
                    cursoId === course.id ? 'border-primary' : 'border-zinc-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="curso"
                    value={course.id}
                    checked={cursoId === course.id}
                    onChange={() => setCursoId(course.id)}
                  />
                  <span className="text-sm font-medium text-zinc-800">
                    {course.nome}
                  </span>
                </label>
              ))}
            </fieldset>
            <Button type="submit" disabled={!cursoId || isSaving}>
              {isSaving ? <Spinner /> : 'Confirmar'}
            </Button>
          </form>
        )}
      </div>
      <CodeDialog
        open={openCode}
        onOpenChange={setOpenCode}
        onSubmit={entrarComCodigo}
      />
    </div>
  );
};
