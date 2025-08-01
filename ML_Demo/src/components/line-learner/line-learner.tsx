"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { DataPoint, Point } from "@/components/line-learner/types";
import { InteractivePlot } from "@/components/line-learner/interactive-plot";
import { Controls } from "@/components/line-learner/controls";
import { getLineParams, calculateMetrics } from "@/lib/line-learner-math";

const PLOT_SIZE = 500;
const NUM_TRAIN_POINTS = 15;
const NUM_TEST_POINTS = 5;
const NOISE_LEVEL = 100;
const POINT_RADIUS = 6;

function generateData(
  numPoints: number,
  slope: number,
  intercept: number,
  noise: number
): DataPoint[] {
  return Array.from({ length: numPoints }, (_, i) => {
    const x = Math.random() * (PLOT_SIZE - 2 * POINT_RADIUS) + POINT_RADIUS;
    const y_perfect = slope * x + intercept;
    const y = y_perfect + (Math.random() - 0.5) * noise;
    return {
      id: `p-${i}-${Date.now()}`,
      x,
      y: Math.max(POINT_RADIUS, Math.min(PLOT_SIZE - POINT_RADIUS, y)),
    };
  });
}

export function LineLearner() {
  const [trainingData, setTrainingData] = useState<DataPoint[]>([]);
  const [testData, setTestData] = useState<DataPoint[]>([]);
  const [isTestMode, setIsTestMode] = useState(false);
  const [lineHandles, setLineHandles] = useState<{ p1: Point; p2: Point }>({
    p1: { x: 50, y: PLOT_SIZE / 2 },
    p2: { x: PLOT_SIZE - 50, y: PLOT_SIZE / 2 },
  });
  const [slopeStep, setSlopeStep] = useState(0.05);

  const resetData = useCallback(() => {
    const trueSlope = (Math.random() - 0.5) * 2; // -1 to 1
    const trueIntercept = Math.random() * (PLOT_SIZE / 2) + PLOT_SIZE / 4;
    setTrainingData(generateData(NUM_TRAIN_POINTS, trueSlope, trueIntercept, NOISE_LEVEL));
    setTestData(generateData(NUM_TEST_POINTS, trueSlope, trueIntercept, NOISE_LEVEL));
  }, []);

  useEffect(() => {
    resetData();
  }, [resetData]);

  const { m, c } = useMemo(
    () => getLineParams(lineHandles.p1, lineHandles.p2),
    [lineHandles]
  );

  const {
    mse: mseTrain,
    bias,
    variance,
  } = useMemo(
    () => calculateMetrics(trainingData, m, c),
    [trainingData, m, c]
  );

  const { mse: mseTest } = useMemo(() => {
    if (isTestMode) {
      return calculateMetrics(testData, m, c);
    }
    return { mse: null };
  }, [isTestMode, testData, m, c]);

  const handleLineChange = useCallback((newHandles: { p1: Point; p2: Point }) => {
    if (!isTestMode) {
      setLineHandles(newHandles);
    }
  }, [isTestMode]);

  const handleTest = useCallback(() => {
    setIsTestMode(true);
  }, []);
  
  const handleSlopeStepChange = useCallback((value: number[]) => {
    setSlopeStep(value[0]);
  }, []);

  const handleReset = useCallback(() => {
    setIsTestMode(false);
    setLineHandles({
      p1: { x: 50, y: PLOT_SIZE / 2 },
      p2: { x: PLOT_SIZE - 50, y: PLOT_SIZE / 2 },
    });
    setSlopeStep(0.05);
    resetData();
  }, [resetData]);

  return (
    <div className="w-full mx-auto flex flex-col gap-8 p-4 bg-card rounded-xl shadow-lg border mt-2">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-primary font-headline tracking-tight">
          LineLearner
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Drag the handles to adjust the line and minimize the Mean Squared Error (MSE) for the training data points. Then, test your model against unseen data.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <InteractivePlot
            trainingData={trainingData}
            testData={testData}
            lineHandles={lineHandles}
            onLineChange={handleLineChange}
            isTestMode={isTestMode}
            plotSize={PLOT_SIZE}
            m={m}
            c={c}
            slopeStep={slopeStep}
          />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Controls
            onTest={handleTest}
            onReset={handleReset}
            isTestMode={isTestMode}
            slopeStep={slopeStep}
            onSlopeStepChange={handleSlopeStepChange}
            bias={bias}
            variance={variance}
            mseTrain={mseTrain}
            mseTest={mseTest}
          />
        </div>
      </div>
    </div>
  );
}
