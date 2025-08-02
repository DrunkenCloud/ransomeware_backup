
import { QueryOptions, QueryOption } from "@/components/query-options";
import { QueryResults } from "@/components/query-results";
import { ContextualHelp } from "@/components/contextual-help";
import { AnswerOptions } from "@/components/answer-options";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";

interface AnswerOption {
    id: string;
    label: string;
}

interface StepData {
    title: string;
    description: string;
    objectives: string[];
    queryOptions: QueryOption[];
    hint: string;
    question: string;
    answerOptions: AnswerOption[];
    correctAnswerId: string;
}

interface InvestigationViewProps {
  stepData: StepData;
  onRunQuery: (queryId: string) => void;
  results: { data: any[]; columns: string[] };
  onAnswerSubmit: () => void;
  selectedAnswer: string | null;
  setSelectedAnswer: (id: string | null) => void;
  ranQuery: string | null;
}

export function InvestigationView({ 
    stepData, 
    onRunQuery, 
    results,
    onAnswerSubmit,
    selectedAnswer,
    setSelectedAnswer,
    ranQuery
}: InvestigationViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 p-4 lg:p-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-headline">{stepData.title}</CardTitle>
                <CardDescription>{stepData.description}</CardDescription>
            </CardHeader>
        </Card>
        
        <QueryOptions
          options={stepData.queryOptions}
          onRunQuery={onRunQuery}
        />
        <QueryResults results={results.data} columns={results.columns} />

        {ranQuery && (
            <AnswerOptions
                question={stepData.question}
                options={stepData.answerOptions}
                selectedAnswer={selectedAnswer}
                setSelectedAnswer={setSelectedAnswer}
                onAnswerSubmit={onAnswerSubmit}
            />
        )}
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <ContextualHelp objectives={stepData.objectives} hint={stepData.hint} />
        </div>
      </div>
    </div>
  );
}
