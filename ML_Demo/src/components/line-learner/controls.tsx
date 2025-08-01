"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

interface ControlsProps {
  onTest: () => void;
  onReset: () => void;
  isTestMode: boolean;
  slopeStep: number;
  onSlopeStepChange: (value: number[]) => void;
  bias: number;
  variance: number;
  mseTrain: number;
  mseTest: number | null;
}

const MetricItem = ({ label, value, isHighlighted = false }: { label: string; value: string; isHighlighted?: boolean; }) => (
    <div className={cn("flex justify-between items-baseline p-3 rounded-lg transition-colors", isHighlighted && "bg-accent/20")}>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={cn("text-lg font-semibold font-mono tracking-tight", isHighlighted ? "text-accent-foreground dark:text-white" : "text-primary")}>{value}</p>
    </div>
)

export function Controls({ 
  onTest, 
  onReset, 
  isTestMode, 
  slopeStep, 
  onSlopeStepChange,
  bias,
  variance,
  mseTrain,
  mseTest
}: ControlsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Adjust, test, and see results.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <Label htmlFor="slope-step" className="text-base">Controls</Label>
          <Separator className="my-2" />
          <div className="space-y-3 pt-2">
              <Label htmlFor="slope-step">Slope Step (Ridge)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="slope-step"
                  min={0.01}
                  max={0.5}
                  step={0.01}
                  value={[slopeStep]}
                  onValueChange={onSlopeStepChange}
                  disabled={isTestMode}
                />
                <span className="text-sm font-mono text-muted-foreground w-12 text-right">{slopeStep.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Controls the "snap" of the line. Smaller values allow finer adjustments.</p>
          </div>
          
          <div className="mt-4">
            {!isTestMode ? (
              <>
                <Button onClick={onTest} size="lg" className="w-full">
                  Finalize & Test Model
                </Button>
                <div className="flex items-start gap-2 text-sm text-muted-foreground p-3 bg-primary/5 rounded-md border border-primary/20 mt-2">
                    <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 text-primary"/>
                    <p>Lock in your line to see how it performs on unseen test data.</p>
                </div>
              </>
            ) : (
              <>
                <Button onClick={onReset} variant="secondary" size="lg" className="w-full">
                  Reset Simulation
                </Button>
                <div className="flex items-start gap-2 text-sm text-muted-foreground p-3 bg-secondary rounded-md border mt-2">
                    <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 text-secondary-foreground"/>
                    <p>Start over with a new set of data points to try again.</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
            <Label className="text-base">Performance</Label>
            <Separator className="my-2" />
            <div className="flex flex-col gap-2 pt-2">
                <MetricItem label="Bias" value={bias.toFixed(3)} />
                <Separator />
                <MetricItem label="Variance (StdDev)" value={variance.toFixed(3)} />
                <Separator />
                <MetricItem label="Training MSE" value={mseTrain.toFixed(3)} />
                <div className={cn("transition-all duration-500 ease-in-out overflow-hidden", isTestMode ? "max-h-40 opacity-100" : "max-h-0 opacity-0")}>
                    {isTestMode && mseTest !== null && (
                        <>
                        <Separator />
                        <MetricItem label="Test MSE" value={mseTest.toFixed(3)} isHighlighted />
                        </>
                    )}
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
