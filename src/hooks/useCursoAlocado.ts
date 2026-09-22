import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '@/providers/UserProvider';

export const useCursoAlocado = (cursoId?: string) => {
  const navigate = useNavigate();
  const { user, isAdmin, isMonitor } = useAuthUser();
  const alocado =
    isAdmin ||
    Boolean(
      cursoId && user && 'cursoIds' in user && user.cursoIds.includes(cursoId)
    );
  const bloqueado = isMonitor && Boolean(cursoId) && !alocado;

  useEffect(() => {
    if (bloqueado) navigate('/cursos', { replace: true });
  }, [bloqueado, navigate]);

  return { alocado, bloqueado };
};
