import React, { useState } from 'react';
import { GRID_SIZE } from '@/lib/network';
import type { GridData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PixelGridProps {
  gridData: GridData;
  onPixelToggle: (x: number, y: number) => void;
  onPixelActivate: (x: number, y: number) => void;
  isReadOnly?: boolean;
}

export default function PixelGrid({ gridData, onPixelToggle, onPixelActivate, isReadOnly = false }: PixelGridProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [initialDragState, setInitialDragState] = useState(false);


  const handleMouseDown = (x: number, y: number) => {
    if (isReadOnly) return;
    setIsDragging(true);
    const currentlyActive = gridData[y][x];
    setInitialDragState(!currentlyActive);
    onPixelToggle(x, y);
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (isReadOnly || !isDragging) return;
    // During a single drag operation, either always activate or always deactivate.
    if (initialDragState) {
        onPixelActivate(x, y);
    } else {
        // This is a bit of a workaround to "deactivate", since we only have toggle/activate.
        // We can't just toggle, because then it would flicker if you drag back and forth.
        // So we just check if it's active before we toggle.
        if(gridData[y][x]) {
            onPixelToggle(x,y)
        }
    }
  };

  const handleMouseUp = () => {
    if (isReadOnly) return;
    setIsDragging(false);
  };

  return (
    <div
      className="grid gap-px aspect-square bg-gray-300 border border-gray-300"
      style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves the grid
    >
      {gridData.map((row, y) =>
        row.map((isActive, x) => (
          <button
            key={`${x}-${y}`}
            onMouseDown={() => handleMouseDown(x, y)}
            onMouseEnter={() => handleMouseEnter(x, y)}
            aria-label={`Pixel ${x}, ${y}`}
            className={cn(
              'w-full aspect-square transition-colors duration-200',
              isActive
                ? 'bg-accent'
                : 'bg-gray-200',
              !isReadOnly && 'cursor-pointer hover:bg-gray-300',
              isReadOnly && 'cursor-default'
            )}
          />
        ))
      )}
    </div>
  );
}
