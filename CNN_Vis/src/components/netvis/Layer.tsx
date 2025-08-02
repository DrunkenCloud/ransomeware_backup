import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface LayerProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onAddNode?: () => void;
}

export default function Layer({ title, icon, onAddNode, children }: LayerProps) {
  return (
    <div className="flex flex-col gap-4 min-w-[250px] max-w-[300px] flex-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold text-primary font-headline">
          {icon}
          <h2>{title}</h2>
        </div>
        {onAddNode && (
          <Button variant="outline" size="sm" onClick={onAddNode}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Node
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-4">
          {React.Children.count(children) > 0 ? (
            children
          ) : (
             <div className="text-center text-muted-foreground py-10 border border-dashed rounded-lg">
              <p>No nodes yet.</p>
              {onAddNode && <p>Click "Add Node" to start.</p>}
            </div>
          )}
      </div>
    </div>
  );
}
