import { LineLearner } from "@/components/line-learner/line-learner";
import { ClassificationCanvas } from "@/components/classification/classification-canvas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Binary } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <Tabs defaultValue="line-learner" className="w-full max-w-7xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="line-learner"><LineChart className="w-4 h-4 mr-2"/>Line Learner</TabsTrigger>
          <TabsTrigger value="classification"><Binary className="w-4 h-4 mr-2"/>Classification</TabsTrigger>
        </TabsList>
        <TabsContent value="line-learner">
          <LineLearner />
        </TabsContent>
        <TabsContent value="classification">
          <ClassificationCanvas />
        </TabsContent>
      </Tabs>
    </main>
  );
}
