import NetVisWorkspace from '@/components/netvis/NetVisWorkspace';
import { BrainCircuit } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <BrainCircuit className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-xl font-bold font-headline text-primary">
              NetVis
            </h1>
          </div>
          <p className="text-sm text-muted-foreground hidden md:block">
            A simple neural network visualizer.
          </p>
        </div>
      </header>
      <main className="flex-1">
        <NetVisWorkspace />
      </main>
    </div>
  );
}
