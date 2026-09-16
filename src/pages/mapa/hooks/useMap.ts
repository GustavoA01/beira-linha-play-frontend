import { backgroundNodes } from '@/pages/mapa/constants/nodesBackgorund';
import { nodesPhases } from '@/pages/mapa/constants/nodesPhases';
import { useCallback, useState } from 'react';
import {
  applyEdgeChanges,
  applyNodeChanges,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react';
import { edgesPhases } from '@/pages/mapa/constants/edges';
import type {
  BackgroundNodeType,
  PhaseEdgeType,
  PhaseNodeType,
} from '@/data/types/reactFlow';
import { useAuthUser } from '@/providers/UserProvider';

export const useMap = () => {
  const { user, isAluno } = useAuthUser();
  const initialNodes = [...backgroundNodes, ...nodesPhases];
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(edgesPhases);

  const onNodesChange = useCallback(
    (changes: NodeChange<BackgroundNodeType | PhaseNodeType>[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<PhaseEdgeType>[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const phaseNodes = nodes.filter(
    (node): node is PhaseNodeType => node.type === 'phase'
  );
  const points = isAluno ? user.pontos : 0;
  const unlockedPhases = phaseNodes.filter(
    (node) => node.data.minPoints <= points
  );

  const currentNode = isAluno
    ? (unlockedPhases.at(-1) ?? phaseNodes[0])
    : phaseNodes[0];

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    currentNode,
    isAluno,
  };
};
