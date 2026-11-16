import { Navigate } from 'react-router-dom';
import { useAuthUser } from '@/providers/UserProvider';
import { ConfigForm } from './components/ConfigForm';

export const ConfiguracoesPage = () => {
  const { isAdmin } = useAuthUser();

  if (!isAdmin) return <Navigate to="/cursos" replace />;

  return (
    <div className="container mx-auto flex min-h-0 flex-1 flex-col overflow-y-auto custom-bar px-4 py-6 sm:px-8">
      <h1 className="font-fredoka text-2xl font-semibold text-primary-dark">
        Configurações
      </h1>
      <p className="mt-1 max-w-xl text-sm text-zinc-500">
        Valores aplicados às atividades de todos os cursos. Com a trava ligada,
        o monitor não consegue alterar o número ao cadastrar.
      </p>
      <ConfigForm />
    </div>
  );
};
