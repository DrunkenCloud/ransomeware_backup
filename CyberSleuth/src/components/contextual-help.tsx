import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lightbulb, ListChecks } from "lucide-react";

interface ContextualHelpProps {
    objectives: string[];
    hint: string;
}

export function ContextualHelp({ objectives, hint }: ContextualHelpProps) {
  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-accent" />
            <span>Current Objectives</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc space-y-2 pl-6 text-sm">
            {objectives.map((obj, index) => <li key={index}>{obj}</li>)}
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            <span>Need a Hint?</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 text-sm">
            <p>{hint}</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

    