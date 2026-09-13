import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
import { currentUser, refresh } from '@/services/auth';

export type SessionStatus = 'loading' | 'anonimo' | 'autenticado';

type SetUserType = (user: UsuarioType | null) => void;

type UserContextType =
  | {
      user: AlunoType;
      setUser: SetUserType;
      status: SessionStatus;
      isAluno: true;
      isMonitor: false;
      isAdmin: false;
    }
  | {
      user: MonitorType;
      setUser: SetUserType;
      status: SessionStatus;
      isAluno: false;
      isMonitor: true;
      isAdmin: false;
    }
  | {
      user: AdminType;
      setUser: SetUserType;
      status: SessionStatus;
      isAluno: false;
      isMonitor: false;
      isAdmin: true;
    }
  | {
      user: null;
      setUser: SetUserType;
      status: SessionStatus;
      isAluno: false;
      isMonitor: false;
      isAdmin: false;
    };

const UserContext = createContext<UserContextType | null>(null);

const statusFromUser = (user: UsuarioType | null): SessionStatus =>
  user ? 'autenticado' : 'anonimo';

export const UserProvider = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: UsuarioType | null;
}) => {
  const skipBoot = initialUser !== undefined;
  const [user, setUserState] = useState<UsuarioType | null>(
    initialUser ?? null
  );
  const [status, setStatus] = useState<SessionStatus>(
    skipBoot ? statusFromUser(initialUser ?? null) : 'loading'
  );

  const setUser = useCallback<SetUserType>((nextUser) => {
    setUserState(nextUser);
    setStatus(statusFromUser(nextUser));
  }, []);

  useEffect(() => {
    if (skipBoot) return;

    let cancelled = false;

    const boot = async () => {
      try {
        const current = await currentUser();
        if (cancelled) return;

        if (current) {
          setUser(current);
          return;
        }

        const restored = await refresh();
        if (cancelled) return;

        setUser(restored);
      } catch {
        if (!cancelled) setUser(null);
      }
    };

    void boot();

    return () => {
      cancelled = true;
    };
  }, [setUser, skipBoot]);

  const value = useMemo((): UserContextType => {
    if (user?.tipo === 'ALUNO') {
      return {
        user,
        setUser,
        status,
        isAluno: true,
        isMonitor: false,
        isAdmin: false,
      };
    }
    if (user?.tipo === 'MONITOR') {
      return {
        user,
        setUser,
        status,
        isAluno: false,
        isMonitor: true,
        isAdmin: false,
      };
    }
    if (user?.tipo === 'ADMIN') {
      return {
        user,
        setUser,
        status,
        isAluno: false,
        isMonitor: false,
        isAdmin: true,
      };
    }
    return {
      user: null,
      setUser,
      status,
      isAluno: false,
      isMonitor: false,
      isAdmin: false,
    };
  }, [setUser, status, user]);

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
