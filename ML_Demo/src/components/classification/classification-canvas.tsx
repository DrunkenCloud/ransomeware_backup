"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import type { Point } from '@/components/line-learner/types';
import type { ClassificationDataPoint } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getLineParams } from '@/lib/line-learner-math';
import { Separator } from '../ui/separator';

const PLOT_SIZE = 500;
const POINT_RADIUS = 6;
const NUM_TRAIN_POINTS_PER_CLASS = 20;
const NUM_TEST_POINTS_PER_CLASS = 10;

interface ClassificationMetrics {
  accuracy: number;
  classA_correct: number;
  classA_total: number;
  classB_correct: number;
  classB_total: number;
}

function generateClassificationData(
  numPointsPerClass: number,
  slope: number,
  intercept: number,
  offset: number
): ClassificationDataPoint[] {
  const data: ClassificationDataPoint[] = [];
  for (let i = 0; i < numPointsPerClass * 2; i++) {
    const x = Math.random() * (PLOT_SIZE - 2 * POINT_RADIUS) + POINT_RADIUS;
    const y_line = slope * x + intercept;
    
    const classType = i < numPointsPerClass ? 'A' : 'B';
    const y_noise = (Math.random() * offset) + (classType === 'A' ? 20 : -20 - offset);
    
    let y = y_line + y_noise;
    y = Math.max(POINT_RADIUS, Math.min(PLOT_SIZE - POINT_RADIUS, y));

    data.push({
      id: `c-${i}-${Date.now()}`,
      x,
      y,
      class: classType,
    });
  }
  return data;
}

const calculateClassificationMetrics = (data: ClassificationDataPoint[], m: number, c: number): ClassificationMetrics => {
  if (data.length === 0 || !isFinite(m)) {
    return { accuracy: 0, classA_correct: 0, classA_total: 0, classB_correct: 0, classB_total: 0 };
  }
  
  let correct = 0;
  let classA_correct = 0;
  let classA_total = 0;
  let classB_correct = 0;
  let classB_total = 0;

  data.forEach(point => {
    const y_line = m * point.x + c;
    const predicted_class = point.y > y_line ? 'B' : 'A';
    
    if (point.class === 'A') {
      classA_total++;
      if (predicted_class === 'A') {
        correct++;
        classA_correct++;
      }
    } else { // Class B
      classB_total++;
      if (predicted_class === 'B') {
        correct++;
        classB_correct++;
      }
    }
  });

  return {
    accuracy: data.length > 0 ? correct / data.length : 0,
    classA_correct,
    classA_total,
    classB_correct,
    classB_total,
  };
};

const Handle = ({ position, onMouseDown, isDraggable }: { position: Point; onMouseDown: (e: React.MouseEvent) => void; isDraggable: boolean }) => (
  <div
    className={cn(
        "absolute w-5 h-5 bg-background border-2 border-accent rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg transition-all duration-200 hover:scale-110",
        isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-not-allowed",
    )}
    style={{ left: position.x, top: position.y, touchAction: 'none' }}
    onMouseDown={isDraggable ? onMouseDown : undefined}
  />
);

const MetricItem = ({ label, value, isHighlighted = false }: { label: string; value: string; isHighlighted?: boolean; }) => (
    <div className={cn("flex justify-between items-baseline p-3 rounded-lg transition-colors", isHighlighted && "bg-accent/20")}>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={cn("text-lg font-semibold font-mono tracking-tight", isHighlighted ? "text-accent-foreground dark:text-white" : "text-primary")}>{value}</p>
    </div>
)

export function ClassificationCanvas() {
  const [trainingData, setTrainingData] = useState<ClassificationDataPoint[]>([]);
  const [testData, setTestData] = useState<ClassificationDataPoint[]>([]);
  const [isTestMode, setIsTestMode] = useState(false);
  const [lineHandles, setLineHandles] = useState<{ p1: Point; p2: Point }>({
    p1: { x: 50, y: PLOT_SIZE / 2 },
    p2: { x: PLOT_SIZE - 50, y: PLOT_SIZE / 2 },
  });
  const plotRef = useRef<HTMLDivElement>(null);
  const [draggingHandle, setDraggingHandle] = useState<"p1" | "p2" | null>(null);

  const resetData = useCallback(() => {
    const trueSlope = (Math.random() - 0.5);
    const trueIntercept = PLOT_SIZE / 2 + (Math.random() - 0.5) * 100;
    const offset = 100;
    setTrainingData(generateClassificationData(NUM_TRAIN_POINTS_PER_CLASS, trueSlope, trueIntercept, offset));
    setTestData(generateClassificationData(NUM_TEST_POINTS_PER_CLASS, trueSlope, trueIntercept, offset));
  }, []);

  const handleReset = useCallback(() => {
    setIsTestMode(false);
    setLineHandles({
      p1: { x: 50, y: PLOT_SIZE / 2 },
      p2: { x: PLOT_SIZE - 50, y: PLOT_SIZE / 2 },
    });
    resetData();
  }, [resetData]);
  
  useEffect(() => {
    handleReset();
  }, [handleReset]);

  const { m, c } = useMemo(
    () => getLineParams(lineHandles.p1, lineHandles.p2),
    [lineHandles]
  );
  
  const getPointFromEvent = (e: MouseEvent | React.MouseEvent): Point => {
    if (!plotRef.current) return { x: 0, y: 0 };
    const rect = plotRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(plotSize, e.clientX - rect.left));
    const y = Math.max(0, Math.min(plotSize, e.clientY - rect.top));
    return { x, y };
  };
  
  const handleMouseDown = useCallback((e: React.MouseEvent, handleId: "p1" | "p2") => {
    if (isTestMode) return;
    e.preventDefault();
    setDraggingHandle(handleId);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newPoint = getPointFromEvent(moveEvent);
      setLineHandles(currentHandles => ({
        ...currentHandles,
        [handleId]: newPoint,
      }));
    };

    const onMouseUp = () => {
      setDraggingHandle(null);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [isTestMode, plotRef.current]);

  const { p1, p2 } = lineHandles;
  const plotSize = PLOT_SIZE;

  // Create polygon points for shading
  const getRegionClipPath = (region: 'above' | 'below') => {
    if (!isFinite(m)) {
        const x_boundary = p1.x;
        if ((region === 'above' && x_boundary < plotSize/2) || (region === 'below' && x_boundary > plotSize/2)) {
            // This logic feels complex, let's simplify for vertical line
            // 'above' is blue (class B), 'below' is red (class A)
            // if we predict B for smaller x, then we shade left blue
            return `polygon(0 0, ${x_boundary}px 0, ${x_boundary}px ${plotSize}px, 0 ${plotSize}px)`;
        }
        return `polygon(${x_boundary}px 0, ${plotSize}px 0, ${plotSize}px ${plotSize}px, ${x_boundary}px ${plotSize}px)`;
    }

    const yAtX0 = c;
    const yAtXMax = m * plotSize + c;

    if (region === 'above') { // Class B - Blue
        return `polygon(0 0, ${plotSize}px 0, ${plotSize}px ${yAtXMax}px, 0 ${yAtX0}px)`;
    } else { // Class A - Red
        return `polygon(0 ${yAtX0}px, ${plotSize}px ${yAtXMax}px, ${plotSize}px ${plotSize}px, 0 ${plotSize}px)`;
    }
  };
  
  const trainMetrics = useMemo(() => calculateClassificationMetrics(trainingData, m, c), [trainingData, m, c]);
  const testMetrics = useMemo(() => {
    if (isTestMode) {
      return calculateClassificationMetrics(testData, m, c);
    }
    return null;
  }, [isTestMode, testData, m, c]);


  return (
    <div className="w-full mx-auto flex flex-col gap-8 p-4 bg-card rounded-xl shadow-lg border mt-2">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-primary font-headline tracking-tight">
          Classification
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Drag the handles to create a boundary that best separates the red and blue data points.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div
            ref={plotRef}
            className="relative w-full aspect-square rounded-lg border-2 bg-card overflow-hidden shadow-inner"
            style={{
              maxWidth: plotSize,
              height: plotSize,
              backgroundImage: 'linear-gradient(to right, hsl(var(--border)/0.5) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)/0.5) 1px, transparent 1px)',
              backgroundSize: '25px 25px',
            }}
          >
            {/* Shaded Regions. Red (destructive) for Class A, Blue (primary) for Class B */}
            <div className="absolute inset-0 bg-destructive/10" style={{ clipPath: getRegionClipPath('below') }} />
            <div className="absolute inset-0 bg-primary/10" style={{ clipPath: getRegionClipPath('above') }} />

            <svg className="absolute top-0 left-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              <line
                x1={0} y1={c}
                x2={plotSize} y2={m * plotSize + c}
                stroke="hsl(var(--accent))"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            
            {trainingData.map((point) => (
              <div
                key={point.id}
                className={cn(
                  "absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500",
                  point.class === 'A' ? 'bg-destructive' : 'bg-primary'
                )}
                style={{ left: point.x, top: point.y }}
              />
            ))}
            
            {testData.map((point) => (
              <div
                key={point.id}
                className={cn(
                  "absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-500 border-2 border-background",
                  point.class === 'A' ? 'bg-destructive' : 'bg-primary',
                  isTestMode ? "opacity-100 scale-100" : "opacity-0 scale-50"
                )}
                style={{ left: point.x, top: point.y }}
              />
            ))}

            <Handle position={p1} onMouseDown={(e) => handleMouseDown(e, 'p1')} isDraggable={!isTestMode} />
            <Handle position={p2} onMouseDown={(e) => handleMouseDown(e, 'p2')} isDraggable={!isTestMode} />
          </div>
        </div>
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Controls</CardTitle>
                    <CardDescription>Actions and performance</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 flex flex-col gap-4">
                     {!isTestMode ? (
                        <Button onClick={() => setIsTestMode(true)} className="w-full" size="lg">Test Classifier</Button>
                    ) : (
                        <Button onClick={handleReset} variant="secondary" className="w-full" size="lg">Reset</Button>
                    )}
                    <Button onClick={resetData} className="w-full">Generate New Data</Button>

                    <Separator className="my-2"/>
                    
                    <div className="flex flex-col gap-2">
                         <MetricItem label="Train Accuracy" value={`${(trainMetrics.accuracy * 100).toFixed(1)}%`} />
                         <Separator />
                         <div className={cn("transition-all duration-500 ease-in-out overflow-hidden", isTestMode ? "max-h-40 opacity-100" : "max-h-0 opacity-0")}>
                            {isTestMode && testMetrics && (
                                <>
                                 <MetricItem label="Test Accuracy" value={`${(testMetrics.accuracy * 100).toFixed(1)}%`} isHighlighted />
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
