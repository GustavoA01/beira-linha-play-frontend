import type { AdminType, AlunoType, MonitorType, UsuarioType } from './api';

export type SessionStatus = 'loading' | 'anonimo' | 'autenticado';
export type SetUserType = (user: UsuarioType | null) => void;
export type UserContextType =
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
