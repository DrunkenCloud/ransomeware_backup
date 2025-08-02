import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit, Check } from 'lucide-react';

interface NodeCardProps {
  title: string;
  onLabelChange: (newLabel: string) => void;
  onDelete: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function NodeCard({ title, onLabelChange, onDelete, children, actions }: NodeCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(title);

  useEffect(() => {
    setLabel(title);
  }, [title]);

  const handleSave = () => {
    onLabelChange(label);
    setIsEditing(false);
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between p-3 bg-slate-50/70">
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <Input 
                value={label} 
                onChange={(e) => setLabel(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="h-8"
            />
            <Button size="icon" className="h-8 w-8" onClick={handleSave}><Check className="w-4 h-4" /></Button>
          </div>
        ) : (
          <CardTitle className="text-base font-medium flex-grow truncate" title={title}>
            {title}
          </CardTitle>
        )}
        <div className="flex items-center gap-1 ml-2">
            {!isEditing && (
                 <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 text-muted-foreground" />
                </Button>
            )}
            {actions}
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDelete}>
                <Trash2 className="w-4 h-4 text-destructive/80" />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        {children}
      </CardContent>
    </Card>
  );
}

    