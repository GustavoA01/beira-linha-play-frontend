import {
  ReactFlow,
  MiniMap,
  type FitViewOptions as FitViewOptionsType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from './constants/nodesPhases';
import { RankTable } from '@/features/RanksTable/container/RanksTable';
import { useMap } from './hooks/useMap';
import { edgeTypes } from './constants/edges';
import { extend, miniMapStyles } from './constants/sizeLimits';

export const Map = () => {
  const { currentNode, edges, nodes, onEdgesChange, onNodesChange } =
    useMap();

  const fitViewOptions = {
    nodes: currentNode ? [{ id: currentNode.id }] : [],
    zoom: 0.8,
    maxZoom: 0.8,
    minZoom: 0.5,
  } as FitViewOptionsType;

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div className="hidden sm:flex container mx-auto">
        <RankTable />
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesConnectable={false}
        nodesDraggable={false}
        elementsSelectable
        maxZoom={1.3}
        minZoom={0.5}
        translateExtent={extend}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        fitViewOptions={fitViewOptions}
      >
        <MiniMap
          pannable
          zoomable
          position="top-right"
          className={miniMapStyles}
          bgColor="transparent"
          nodeColor={({ type }) =>
            type === 'background' ? 'transparent' : '#2D5586'
          }
        />
      </ReactFlow>
    </div>
  );
};
