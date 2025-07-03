"use client";

import React from 'react';
import type { Node, Edge, ActionType } from '@/lib/types';
import { Server, Shield, Bug } from 'lucide-react';

interface NetworkGraphProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick: (nodeId: string) => void;
  activeAction: ActionType | null;
}

const stateConfig = {
  healthy: {
    fill: 'hsl(var(--card))',
    stroke: 'hsl(var(--primary))',
    icon: Server,
    iconColor: 'hsl(var(--primary))',
    textColor: 'hsl(var(--foreground))',
  },
  infected: {
    fill: 'hsl(var(--destructive) / 0.2)',
    stroke: 'hsl(var(--destructive))',
    icon: Bug,
    iconColor: 'hsl(var(--destructive))',
    textColor: 'hsl(var(--destructive))',
  },
  hardened: {
    fill: 'hsl(var(--primary) / 0.2)',
    stroke: 'hsl(var(--primary))',
    icon: Shield,
    iconColor: 'hsl(var(--primary))',
    textColor: 'hsl(var(--primary))',
  },
};

export default function NetworkGraph({ nodes, edges, onNodeClick, activeAction }: NetworkGraphProps) {
  const isAttackerAction = activeAction?.startsWith('deploy') || activeAction === 'exfiltrate_data';
  const cursorClass = activeAction ? (isAttackerAction ? 'cursor-crosshair' : 'cursor-grab') : 'cursor-default';

  return (
    <div className="w-full h-full relative">
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .node-infected-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .node-hardened-shield {
          animation: rotate 10s linear infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
      `}</style>
      <svg viewBox="0 0 900 600" className={`w-full h-full ${cursorClass}`}>
        <g>
          {edges.map((edge, i) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;
            return (
              <line
                key={`edge-${i}`}
                x1={fromNode.x} y1={fromNode.y}
                x2={toNode.x} y2={toNode.y}
                stroke="hsl(var(--border))"
                strokeWidth="2"
              />
            );
          })}
        </g>
        {nodes.map(node => {
          const config = stateConfig[node.state];
          const NodeIcon = config.icon;

          return (
            <g key={node.id} onClick={() => onNodeClick(node.id)} className="cursor-pointer group" transform={`translate(${node.x}, ${node.y})`}>
              {node.state === 'infected' && (
                <circle r="40" fill="none" stroke={config.stroke} strokeWidth="2" className="node-infected-pulse" />
              )}
              {node.state === 'hardened' && (
                <circle r="45" fill="none" stroke={config.stroke} strokeWidth="3" strokeDasharray="10 5" className="node-hardened-shield" />
              )}

              <circle r="40" fill={config.fill} stroke={config.stroke} strokeWidth="2" className="transition-all duration-300 group-hover:stroke-width-4 group-hover:scale-105 transform-gpu" />
              
              <foreignObject x="-20" y="-20" width="40" height="40">
                <NodeIcon className="w-full h-full transition-colors duration-300" style={{ color: config.iconColor }} />
              </foreignObject>

              <text x="0" y="60" textAnchor="middle" fill={config.textColor} className="font-semibold text-lg transition-colors duration-300 select-none">
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
