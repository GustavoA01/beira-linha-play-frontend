import type { BackgroundNodeProps } from '@/data/types/reactFlow';
import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

const BackgroundNode = ({
  id,
  data: { width, height, image, alt },
}: BackgroundNodeProps) => (
  <div
    className="relative overflow-hidden"
    // Small overlap prevents subpixel gaps between tiles at different zoom levels.
    style={{ width: width + 4, height: height + 4, pointerEvents: 'none' }}
  >
    <img
      src={image}
      alt={alt}
      draggable={false}
      className="absolute max-w-none object-cover"
      // Trim the pale export borders without modifying the source assets.
      style={{
        left: -12,
        top: -12,
        width: 'calc(100% + 24px)',
        height: 'calc(100% + 24px)',
      }}
    />
    <Handle
      id={`${id}-top`}
      type="source"
      position={Position.Top}
      className="hidden"
    />
    <Handle
      id={`${id}-bottom`}
      type="target"
      position={Position.Bottom}
      className="hidden"
    />
  </div>
);

export default memo(BackgroundNode);
