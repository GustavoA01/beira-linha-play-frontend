import { CustomEdge } from '@/pages/mapa/components/trail/CustomEdge';
import type { PhaseEdgeType } from '@/data/types/reactFlow';
import { nodesPhases } from './nodesPhases';

export const edgeTypes = {
  'custom-edge': CustomEdge,
};

export const edgesPhases: PhaseEdgeType[] = nodesPhases
  .slice(0, -1)
  .map((node, index) => {
    const next = nodesPhases[index + 1];
    return {
      id: `${node.id}-${next.id}`,
      source: node.id,
      target: next.id,
      type: 'custom-edge',
    };
  });
