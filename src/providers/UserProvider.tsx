import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AdminType,
  AlunoType,
  MonitorType,
  UsuarioType,
} from '@/data/types/api';
import { mockLoggedAluno } from '@/data/temporaryMocks/usuario';
import { mockLoggedMonitor } from '@/data/temporaryMocks/monitores';
import { mockLoggedAdmin } from '@/data/temporaryMocks/admins';

type SetUserType = (user: UsuarioType | null) => void;

type UserContextType =
  | {
      user: AlunoType;
      setUser: SetUserType;
      isAluno: true;
      isMonitor: false;
      isAdmin: false;
    }
  | {
      user: MonitorType;
      setUser: SetUserType;
      isAluno: false;
      isMonitor: true;
      isAdmin: false;
    }
  | {
      user: AdminType;
      setUser: SetUserType;
      isAluno: false;
      isMonitor: false;
      isAdmin: true;
    }
  | {
      user: null;
      setUser: SetUserType;
      isAluno: false;
      isMonitor: false;
      isAdmin: false;
    };

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({
  children,
  initialUser = mockLoggedAluno,
}: {
  children: ReactNode;
  initialUser?: UsuarioType | null;
}) => {
  const [user, setUser] = useState<UsuarioType | null>(initialUser);

  const value = useMemo((): UserContextType => {
    if (user?.tipo === 'ALUNO') {
      return { user, setUser, isAluno: true, isMonitor: false, isAdmin: false };
    }
    if (user?.tipo === 'MONITOR') {
      return { user, setUser, isAluno: false, isMonitor: true, isAdmin: false };
    }
    if (user?.tipo === 'ADMIN') {
      return { user, setUser, isAluno: false, isMonitor: false, isAdmin: true };
    }
    return {
      user: null,
      setUser,
      isAluno: false,
      isMonitor: false,
      isAdmin: false,
    };
  }, [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserProvider = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserProvider precisa estar dentro de UserProvider');
  }
  return context;
};

export const useAuthUser = () => {
  const context = useUserProvider();
  if (!context.user) {
    throw new Error('useAuthUser precisa estar dentro de RequireAuth');
  }
  return context;
};
