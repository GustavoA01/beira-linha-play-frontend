import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { SplashScreen } from '@/components/SplashScreen';
import {
  desafioEntradaConfirmada,
  limparEntradaDesafio,
} from '@/data/desafioEntrada';
import { useConfiguracao } from '@/hooks/useConfiguracao';
import { useAuthUser } from '@/providers/UserProvider';

export const DesafioGate = () => {
  const { user } = useAuthUser();
  const { data: config, isPending } = useConfiguracao();
  const { pathname } = useLocation();
  const [versao, setVersao] = useState(0);
  const desafioAtivo = Boolean(config?.desafioAtivo);

  useEffect(() => {
    if (!config?.desafioAtivo) return;
    if (user?.tipo !== 'ALUNO' || user.cursoPontuadoId) return;
    if (pathname === '/desafio') return;
    limparEntradaDesafio();
    setVersao((atual) => atual + 1);
  }, [config?.desafioAtivo, pathname, user]);

  if (isPending) return <SplashScreen />;

  const confirmada = desafioEntradaConfirmada();
  void versao;
  const aluno = user?.tipo === 'ALUNO' ? user : null;
  const precisaEscolher =
    aluno != null && desafioAtivo && (!confirmada || !aluno.cursoPontuadoId);

  if (precisaEscolher && pathname !== '/desafio') {
    return <Navigate to="/desafio" replace />;
  }
  if (!precisaEscolher && pathname === '/desafio') {
    return <Navigate to={aluno ? '/' : '/cursos'} replace />;
  }

  return <Outlet />;
};
