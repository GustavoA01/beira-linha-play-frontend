import BackgroundNode from '@/pages/mapa/components/trail/BackgroundNode';
import { PhaseNode } from '@/pages/mapa/components/trail/PhaseNode';
import type { PhaseNodeType } from '@/data/types/reactFlow';
import type { NodeTypes } from '@xyflow/react';

export const LOCKED_GLOW = [
  { color: '#3a6ea5', strength: 0.4 },
  { color: '#0284c7', strength: 1 },
  { color: '#6128a3', strength: 0.2 },
  { color: '#3a6ea5', strength: 0.4 },
] as const;

export const UNLOCKED_GLOW = [
  { color: '#4ade80', strength: 0.45 },
  { color: '#a3e635', strength: 1 },
  { color: '#86efac', strength: 0.55 },
  { color: '#4ade80', strength: 0.45 },
] as const;

const FIRST_PHASE_XP = 1;
const EASY_STEP = 3;
const HARD_STEP = 4;
const EASY_UNTIL_PHASE = 9;

export const nodeTypes: NodeTypes = {
  phase: PhaseNode,
  background: BackgroundNode,
};

const minPointsOf = (phase: number) => {
  if (phase === 1) return FIRST_PHASE_XP;

  if (phase <= EASY_UNTIL_PHASE) {
    return FIRST_PHASE_XP + (phase - 1) * EASY_STEP;
  }

  const easyEndXp = FIRST_PHASE_XP + (EASY_UNTIL_PHASE - 1) * EASY_STEP;
  return easyEndXp + (phase - EASY_UNTIL_PHASE) * HARD_STEP;
};

const phaseLayouts: Array<Pick<PhaseNodeType, 'id' | 'position'>> = [
  { id: '1', position: { x: 0, y: 0 } },
  { id: '2', position: { x: 210, y: -580 } },
  { id: '3', position: { x: -190, y: -1160 } },
  { id: '4', position: { x: 130, y: -1750 } },
  { id: '5', position: { x: -240, y: -2300 } },
  { id: '6', position: { x: 340, y: -2625 } },
  { id: '7', position: { x: 200, y: -3250 } },
  { id: '8', position: { x: 360, y: -3875 } },
  { id: '9', position: { x: 250, y: -4500 } },
  { id: '10', position: { x: -40, y: -4750 } },
  { id: '11', position: { x: -250, y: -5125 } },
  { id: '12', position: { x: -200, y: -5500 } },
  { id: '13', position: { x: 270, y: -5875 } },
  { id: '14', position: { x: 320, y: -6250 } },
  { id: '15', position: { x: 200, y: -6625 } },
  { id: '16', position: { x: 250, y: -7000 } },
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

export const faseAvancada = (pontosAntes: number, pontosDepois: number) => {
  let avancada: { id: string; minPoints: number } | null = null;

  for (const phase of nodesPhases) {
    const { id, minPoints } = phase.data;
    if (pontosAntes < minPoints && pontosDepois >= minPoints) {
      avancada = { id, minPoints };
    }
  }

  return avancada;
};
