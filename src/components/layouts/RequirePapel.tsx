import { Navigate, Outlet } from 'react-router-dom';
import type { UsuarioType } from '@/data/types/api';
import { useAuthUser } from '@/providers/UserProvider';

type RequirePapelProps = {
  papeis: UsuarioType['tipo'][];
};

export const RequirePapel = ({ papeis }: RequirePapelProps) => {
  const { user } = useAuthUser();

  if (!papeis.includes(user.tipo)) {
    return <Navigate to="/cursos" replace />;
  }

  return <Outlet />;
};

export const RequireMonitor = () => <RequirePapel papeis={['MONITOR']} />;
