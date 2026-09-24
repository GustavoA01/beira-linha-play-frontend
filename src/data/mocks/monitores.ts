import type { MonitorType } from '@/data/types/api';

export const temporaryMonitores: MonitorType[] = [
  {
    id: 'monitor-1',
    nome: 'Maria Souza',
    email: 'maria.souza@pucminas.br',
    tipo: 'MONITOR',
    cursoIds: ['curso-calculo-1'],
  },
  {
    id: 'monitor-2',
    nome: 'Pedro Alves',
    email: 'pedro.alves@pucminas.br',
    tipo: 'MONITOR',
    cursoIds: ['curso-prog-1'],
  },
  {
    id: 'monitor-3',
    nome: 'Ana Costa',
    email: 'ana.costa@pucminas.br',
    tipo: 'MONITOR',
    cursoIds: ['curso-fisica-1'],
  },
  {
    id: 'monitor-4',
    nome: 'Carlos Lima',
    email: 'carlos.lima@pucminas.br',
    tipo: 'MONITOR',
    cursoIds: ['curso-bd-1'],
  },
];

export const getMonitorById = (id: string) =>
  temporaryMonitores.find((monitor) => monitor.id === id);

export const getMonitoresNomes = (ids: string[]) =>
  ids
    .map((id) => getMonitorById(id)?.nome)
    .filter((nome): nome is string => Boolean(nome))
    .join(', ') || 'Monitor';

export const mockLoggedMonitor: MonitorType = temporaryMonitores[0];
