import { createBrowserRouter } from 'react-router-dom';
import { HeaderLayout } from './components/layouts/HeaderLayout';
import { RequireAuth } from './components/layouts/RequireAuth';
import { RequireGuest } from './components/layouts/RequireGuest';
import { RequireMonitor } from './components/layouts/RequirePapel';
import { Map } from './pages/mapa';
import { CoursesPage } from './pages/cursos';
import { MedalsPage } from './pages/medalhas';
import { CoursePage } from './pages/curso';
import { ModulePage } from './pages/modulo';
import { NewActivityPage } from './pages/nova-atividade';
import { Home } from './pages/home';
import { ManagementPage } from './pages/monitoramento';
import { NotFoundPage } from './pages/notFound';
import { ErrorPage } from './pages/error';
import { RankingsPage } from './pages/rankings';
import { EditAccountPage } from './pages/auth/editAccount';
import { RegisterPage } from './pages/auth/register';
import { LoginPage } from './pages/auth/login';
import { ActivityPage } from './pages/atividade';

export const Router = createBrowserRouter([
  {
    ErrorBoundary: ErrorPage,
    children: [
      {
        Component: RequireGuest,
        children: [
          {
            path: '/login',
            Component: LoginPage,
          },
          {
            path: '/cadastro',
            Component: RegisterPage,
          },
        ],
      },
      {
        Component: RequireAuth,
        children: [
          {
            path: '/',
            Component: HeaderLayout,
            children: [
              {
                index: true,
                Component: Home,
              },
              {
                path: 'mapa',
                Component: Map,
              },
              {
                path: 'cursos',
                Component: CoursesPage,
              },
              {
                path: 'rankings',
                Component: RankingsPage,
              },
              {
                path: 'medalhas',
                Component: MedalsPage,
              },
            ],
          },
          {
            path: '/editar-conta',
            Component: EditAccountPage,
          },
          {
            path: '/cursos/:cursoId',
            Component: CoursePage,
          },
          {
            path: '/cursos/:cursoId/modulos/:moduloId',
            Component: ModulePage,
          },
          {
            path: '/cursos/:cursoId/modulos/:moduloId/atividade/:atividadeId',
            Component: ActivityPage,
          },
          {
            path: '/cursos/:cursoId/modulos/:moduloId/atividades/:atividadeId',
            Component: ActivityPage,
          },
          {
            Component: RequireMonitor,
            children: [
              {
                path: '/cursos/:cursoId/modulos/:moduloId/nova-atividade',
                Component: NewActivityPage,
              },
              {
                path: '/cursos/:cursoId/modulos/:moduloId/nova-atividade/:atividadeId',
                Component: NewActivityPage,
              },
              {
                path: '/cursos/:cursoId/modulos/:moduloId/monitoramento/:atividadeId',
                Component: ManagementPage,
              },
            ],
          },
          {
            path: '*',
            Component: NotFoundPage,
          },
        ],
      },
    ],
  },
]);
