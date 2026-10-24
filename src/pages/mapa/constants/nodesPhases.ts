import type { PhaseNodeType } from '@/data/types/reactFlow';

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
const ADVANCED_FROM_PHASE = 25;
const ADVANCED_STEP = 5;

const minPointsOf = (phase: number) => {
  if (phase === 1) return FIRST_PHASE_XP;

  if (phase <= EASY_UNTIL_PHASE) {
    return FIRST_PHASE_XP + (phase - 1) * EASY_STEP;
  }

  const easyEndXp = FIRST_PHASE_XP + (EASY_UNTIL_PHASE - 1) * EASY_STEP;
  if (phase < ADVANCED_FROM_PHASE) {
    return easyEndXp + (phase - EASY_UNTIL_PHASE) * HARD_STEP;
  }

  const previousPhaseXp =
    easyEndXp + (ADVANCED_FROM_PHASE - 1 - EASY_UNTIL_PHASE) * HARD_STEP;
  return previousPhaseXp + (phase - ADVANCED_FROM_PHASE + 1) * ADVANCED_STEP;
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
  { id: '17', position: { x: -160, y: -7375 } },
  { id: '18', position: { x: -260, y: -7750 } },
  { id: '19', position: { x: 210, y: -8125 } },
  { id: '20', position: { x: 300, y: -8500 } },
  { id: '21', position: { x: 160, y: -8875 } },
  { id: '22', position: { x: -200, y: -9250 } },
  { id: '23', position: { x: 200, y: -9625 } },
  { id: '24', position: { x: 300, y: -10000 } },
  { id: '25', position: { x: 160, y: -10350 } },
  { id: '26', position: { x: -200, y: -10700 } },
  { id: '27', position: { x: 200, y: -11050 } },
  { id: '28', position: { x: 300, y: -11400 } },
  { id: '29', position: { x: 160, y: -11750 } },
  { id: '30', position: { x: -200, y: -12100 } },
  { id: '31', position: { x: 200, y: -12450 } },
  { id: '32', position: { x: 300, y: -12800 } },
  { id: '33', position: { x: 420, y: -13150 } },
  { id: '34', position: { x: 600, y: -13500 } },
  { id: '35', position: { x: 300, y: -13850 } },
  { id: '36', position: { x: -650, y: -14200 } },
  { id: '37', position: { x: -850, y: -14550 } },
  { id: '38', position: { x: -100, y: -14900 } },
  { id: '39', position: { x: 450, y: -15250 } },
  { id: '40', position: { x: 600, y: -15600 } },
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
