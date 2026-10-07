import type { NodeTypes } from '@xyflow/react';
import BackgroundNode from '@/pages/mapa/components/trail/BackgroundNode';
import { PhaseNode } from '@/pages/mapa/components/trail/PhaseNode';

export const nodeTypes: NodeTypes = {
  phase: PhaseNode,
  background: BackgroundNode,
};
