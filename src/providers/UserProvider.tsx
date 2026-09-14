import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { UsuarioType } from '@/data/types/api';
import { currentUser } from '@/services/auth';
import type {
  SessionStatus,
  SetUserType,
  UserContextType,
} from '@/data/types/providers';

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
        setUser(current);
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
    const shared = { setUser, status };

    if (user?.tipo === 'ALUNO') {
      return {
        ...shared,
        user,
        isAluno: true,
        isMonitor: false,
        isAdmin: false,
      };
    } else if (user?.tipo === 'MONITOR') {
      return {
        ...shared,
        user,
        isAluno: false,
        isMonitor: true,
        isAdmin: false,
      };
    } else if (user?.tipo === 'ADMIN') {
      return {
        ...shared,
        user,
        isAluno: false,
        isMonitor: false,
        isAdmin: true,
      };
    }

    return {
      ...shared,
      user: null,
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
