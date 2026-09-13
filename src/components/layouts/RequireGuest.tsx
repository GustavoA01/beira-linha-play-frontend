import { Navigate, Outlet } from 'react-router-dom';
import { SplashScreen } from '@/components/SplashScreen';
import { useUserProvider } from '@/providers/UserProvider';

export const RequireGuest = () => {
  const { status, user } = useUserProvider();

  if (status === 'loading') {
    return <SplashScreen />;
  }

  if (status === 'autenticado' && user) {
    return <Navigate to={user.tipo === 'ALUNO' ? '/' : '/cursos'} replace />;
  }

  return <Outlet />;
};
