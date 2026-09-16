import BackgroundNode from '@/pages/mapa/components/trail/BackgroundNode';
import { PhaseNode } from '@/pages/mapa/components/trail/PhaseNode';
import type { PhaseNodeType } from '@/data/types/reactFlow';
import type { NodeTypes } from '@xyflow/react';

export const nodeTypes: NodeTypes = {
  phase: PhaseNode,
  background: BackgroundNode,
};

const FIRST_REGION_PHASES = 9;
const FIRST_REGION_XP = 20;
const XP_PER_PHASE_AFTER = 2;

const minPointsOf = (phase: number) => {
  if (phase <= FIRST_REGION_PHASES) {
    return Math.round((phase / FIRST_REGION_PHASES) * FIRST_REGION_XP) || 1;
  }

  return FIRST_REGION_XP + (phase - FIRST_REGION_PHASES) * XP_PER_PHASE_AFTER;
};

const phaseLayouts: Array<Pick<PhaseNodeType, 'id' | 'position'>> = [
  { id: '1', position: { x: 0, y: 0 } },
  { id: '2', position: { x: 80, y: -150 } },
  { id: '3', position: { x: -80, y: -300 } },
  { id: '4', position: { x: 160, y: -500 } },
  { id: '5', position: { x: 80, y: -750 } },
  { id: '6', position: { x: -80, y: -1000 } },
  { id: '7', position: { x: 90, y: -1250 } },
  { id: '8', position: { x: 0, y: -1500 } },
  { id: '9', position: { x: 80, y: -1750 } },
  { id: '10', position: { x: -80, y: -2000 } },
  { id: '11', position: { x: 150, y: -2250 } },
  { id: '12', position: { x: 0, y: -2500 } },
  { id: '13', position: { x: -140, y: -2750 } },
  { id: '14', position: { x: -60, y: -3000 } },
  { id: '15', position: { x: 90, y: -3250 } },
  { id: '16', position: { x: 160, y: -3500 } },
  { id: '17', position: { x: 50, y: -3750 } },
  { id: '18', position: { x: -100, y: -4000 } },
  { id: '19', position: { x: -160, y: -4250 } },
  { id: '20', position: { x: 20, y: -4500 } },
  { id: '21', position: { x: -180, y: -4750 } },
  { id: '22', position: { x: -280, y: -5000 } },
  { id: '23', position: { x: -40, y: -5250 } },
  { id: '24', position: { x: 220, y: -5500 } },
  { id: '25', position: { x: 300, y: -5750 } },
  { id: '26', position: { x: 90, y: -6000 } },
  { id: '27', position: { x: -50, y: -6250 } },
  { id: '28', position: { x: -220, y: -6500 } },
  { id: '29', position: { x: -300, y: -6750 } },
  { id: '30', position: { x: -90, y: -7000 } },
];

export const nodesPhases: PhaseNodeType[] = phaseLayouts.map(
  (phase, index) => ({
    id: phase.id,
    type: 'phase',
    position: phase.position,
    data: {
      id: phase.id,
      minPoints: minPointsOf(index + 1),
    },
  })
);

const nodeLastIndex = nodesPhases[nodesPhases.length - 1];
export const nodesLastPosition = nodeLastIndex.position.y - 200;
