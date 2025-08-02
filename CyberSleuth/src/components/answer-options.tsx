
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, HelpCircle } from "lucide-react";

interface AnswerOption {
  id: string;
  label: string;
}

interface AnswerOptionsProps {
  question: string;
  options: AnswerOption[];
  selectedAnswer: string | null;
  setSelectedAnswer: (id: string | null) => void;
  onAnswerSubmit: () => void;
}

export function AnswerOptions({ question, options, selectedAnswer, setSelectedAnswer, onAnswerSubmit }: AnswerOptionsProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-muted/50">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-5 w-5" />
          <div className="flex flex-col">
            <CardTitle className="text-lg">Answer the Question</CardTitle>
            <CardDescription className="text-sm">{question}</CardDescription>
          </div>
        </div>
        <Button size="sm" onClick={onAnswerSubmit} disabled={!selectedAnswer}>
          <Check className="mr-2 h-4 w-4" />
          Submit Answer
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <RadioGroup value={selectedAnswer ?? ""} onValueChange={setSelectedAnswer}>
          <div className="space-y-4">
            {options.map((option) => (
              <div key={option.id} className="flex items-start gap-3 rounded-md border p-4 has-[[data-state=checked]]:bg-accent/10 has-[[data-state=checked]]:border-accent">
                <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                  <span className="font-medium">{option.label}</span>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
