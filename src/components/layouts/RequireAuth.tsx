import { Navigate, Outlet } from 'react-router-dom';
import { SplashScreen } from '@/components/SplashScreen';
import { useUserProvider } from '@/providers/UserProvider';

export const RequireAuth = () => {
  const { status } = useUserProvider();
  if (status === 'loading') return <SplashScreen />;
  if (status === 'anonimo') return <Navigate to="/login" replace />;
  return <Outlet />;
};
