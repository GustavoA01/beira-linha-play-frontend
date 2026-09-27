import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthUser } from '@/providers/UserProvider';
import { MapFallback } from './mapa/MapFallback';

const Map = lazy(() =>
  import('./mapa').then((module) => ({ default: module.Map }))
);

export const Home = () => {
  const { isMonitor, isAdmin } = useAuthUser();
  if (isMonitor || isAdmin) return <Navigate to="/cursos" replace />;
  return (
    <Suspense fallback={<MapFallback />}>
      <Map />
    </Suspense>
  );
};
