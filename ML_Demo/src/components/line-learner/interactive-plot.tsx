"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { DataPoint, Point } from "./types";

interface InteractivePlotProps {
  trainingData: DataPoint[];
  testData: DataPoint[];
  lineHandles: { p1: Point; p2: Point };
  onLineChange: (handles: { p1: Point; p2: Point }) => void;
  isTestMode: boolean;
  plotSize: number;
  m: number;
  c: number;
  slopeStep: number;
}

const Handle = ({ position, onMouseDown, isDraggable }: { position: Point; onMouseDown: (e: React.MouseEvent) => void; isDraggable: boolean; }) => (
  <div
    className={cn(
      "absolute w-5 h-5 bg-background border-2 border-accent rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg",
      isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-not-allowed",
      "transition-all duration-200 hover:scale-110"
    )}
    style={{ left: position.x, top: position.y, touchAction: 'none' }}
    onMouseDown={isDraggable ? onMouseDown : undefined}
  />
);

function getSteppedLinePath(m: number, c: number, stepLength: number, plotSize: number): string {
  if (stepLength <= 0 || !isFinite(m)) {
    const yAt0 = c;
    const yAtMax = m * plotSize + c;
    return `M 0 ${yAt0} L ${plotSize} ${yAtMax}`;
  }

  const path: Point[] = [];
  let currentY = c;
  path.push({ x: 0, y: currentY });

  const numSteps = Math.floor(plotSize / stepLength);
  const yPerStep = m * stepLength;

  for (let i = 0; i < numSteps; i++) {
    const currentX = (i + 1) * stepLength;
    path.push({ x: currentX, y: currentY }); // Horizontal segment
    currentY += yPerStep;
    path.push({ x: currentX, y: currentY }); // Vertical segment
  }
  
  // Final segment to the edge
  const finalY = m * plotSize + c;
  path.push({ x: plotSize, y: path[path.length - 1].y});
  path.push({ x: plotSize, y: finalY});


  return path.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
}

export function InteractivePlot({
  trainingData,
  testData,
  lineHandles,
  onLineChange,
  isTestMode,
  plotSize,
  m,
  c,
  slopeStep
}: InteractivePlotProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  const [draggingHandle, setDraggingHandle] = useState<"p1" | "p2" | null>(null);

  const getPointFromEvent = (e: MouseEvent | React.MouseEvent): Point => {
    if (!plotRef.current) return { x: 0, y: 0 };
    const rect = plotRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(plotSize, e.clientX - rect.left));
    const y = Math.max(0, Math.min(plotSize, e.clientY - rect.top));
    return { x, y };
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, handleId: "p1" | "p2") => {
    if (isTestMode) return;
    e.preventDefault();
    setDraggingHandle(handleId);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newPoint = getPointFromEvent(moveEvent);
      onLineChange({
        ...lineHandles,
        [handleId]: newPoint,
      });
    };

    const onMouseUp = () => {
      setDraggingHandle(null);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [isTestMode, onLineChange, lineHandles, plotSize]);

  const stepLength = slopeStep * plotSize;
  const steppedPath = getSteppedLinePath(m, c, stepLength, plotSize);


  return (
    <div
      ref={plotRef}
      className="relative w-full aspect-square rounded-lg border-2 bg-card overflow-hidden shadow-inner"
      style={{
        maxWidth: plotSize,
        height: plotSize,
        backgroundImage: 'linear-gradient(to right, hsl(var(--border)/0.5) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)/0.5) 1px, transparent 1px)',
        backgroundSize: '25px 25px',
      }}
    >
      <svg className="absolute top-0 left-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <path
          d={steppedPath}
          stroke="hsl(var(--accent))"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-100 ease-linear"
        />
        {/* Render error lines */}
        {trainingData.map(p => {
            const y_pred = m * p.x + c;
            return <line key={`err-${p.id}`} x1={p.x} y1={p.y} x2={p.x} y2={y_pred} stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="2,2"/>
        })}
      </svg>
      
      {trainingData.map((point) => (
        <div
          key={point.id}
          className="absolute w-3 h-3 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500"
          style={{ left: point.x, top: point.y }}
        />
      ))}

      {testData.map((point) => (
        <div
          key={point.id}
          className={cn(
            "absolute w-3 h-3 bg-destructive rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-500",
            isTestMode ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}
          style={{ left: point.x, top: point.y }}
        />
      ))}

      <Handle position={lineHandles.p1} onMouseDown={(e) => handleMouseDown(e, 'p1')} isDraggable={!isTestMode}/>
      <Handle position={lineHandles.p2} onMouseDown={(e) => handleMouseDown(e, 'p2')} isDraggable={!isTestMode}/>
    </div>
  );
}
