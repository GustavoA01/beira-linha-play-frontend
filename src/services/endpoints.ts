export const endpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/cadastro',
    currentUser: '/api/auth/me',
    refresh: '/api/auth/refresh',
    logout: '/api/auth/logout',
  },
  courses: {
    list: '/api/cursos',
    byId: (id: string) => `/api/cursos/${id}`,
    enroll: (id: string) => `/api/cursos/${id}/inscrever`,
    modules: (courseId: string) => `/api/cursos/${courseId}/modulos`,
  },
  modules: {
    byId: (id: string) => `/api/modulos/${id}`,
    activities: (moduleId: string) => `/api/modulos/${moduleId}/atividades`,
  },
  activities: {
    byId: (id: string) => `/api/atividades/${id}`,
    monitoring: (id: string) => `/api/atividades/${id}/monitoramento`,
    attempts: (activityId: string) =>
      `/api/atividades/${activityId}/tentativas`,
  },
  attempts: {
    mine: '/api/alunos/me/tentativas',
  },
  users: {
    me: '/api/usuarios/me',
    admins: '/api/admins',
    monitors: '/api/monitores',
  },
  medals: {
    list: '/api/medalhas',
    byId: (id: string) => `/api/medalhas/${id}`,
    equip: (id: string) => `/api/medalhas/${id}/equipar`,
  },
  rankings: {
    list: '/api/rankings',
  },
} as const;
