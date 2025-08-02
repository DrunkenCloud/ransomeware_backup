
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Play } from "lucide-react";

export interface QueryOption {
  id: string;
  query: string;
}

interface QueryOptionsProps {
  options: QueryOption[];
  onRunQuery: (queryId: string) => void;
}

export function QueryOptions({ options, onRunQuery }: QueryOptionsProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-muted/50">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5" />
          <CardTitle className="text-lg">Run a Query</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {options.map((option) => (
            <div key={option.id} className="flex items-start gap-4 rounded-md border p-4">
              <pre className="flex-1 font-code text-sm rounded-md overflow-x-auto">{option.query}</pre>
              <Button size="sm" onClick={() => onRunQuery(option.id)}>
                <Play className="mr-2 h-4 w-4" />
                Run
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
