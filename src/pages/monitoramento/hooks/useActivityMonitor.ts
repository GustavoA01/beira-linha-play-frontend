import type { AtividadeType } from '@/data/types/api';
import type { MonitoringResponseType } from '@/data/types/services';
import { toMonitoring } from '../utils';

export { alternativeLetter } from '../utils';

export const useActivityMonitor = (
  activity: AtividadeType,
  monitoring: MonitoringResponseType
) => toMonitoring(activity, monitoring);
