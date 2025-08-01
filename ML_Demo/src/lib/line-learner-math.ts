import type { Point, DataPoint } from '@/components/line-learner/types';

export function getLineParams(p1: Point, p2: Point): { m: number, c: number } {
  if (p2.x - p1.x === 0) return { m: Infinity, c: p1.x }; // Vertical line case
  
  const m = (p2.y - p1.y) / (p2.x - p1.x);
  const c = p1.y - m * p1.x;

  return { m, c };
}

export function calculateMetrics(data: DataPoint[], m: number, c: number) {
  if (data.length === 0 || !isFinite(m)) {
    return { mse: Infinity, bias: Infinity, variance: Infinity };
  }

  const errors = data.map(point => {
    const y_pred = m * point.x + c;
    return point.y - y_pred;
  });
  
  const squaredErrors = errors.reduce((sum, err) => sum + err * err, 0);

  const mse = squaredErrors / errors.length;
  
  const bias = errors.reduce((sum, err) => sum + err, 0) / errors.length;
  
  const varianceOfErrors = errors.reduce((sum, err) => sum + Math.pow(err - bias, 2), 0) / errors.length;
  const variance = Math.sqrt(varianceOfErrors);
  
  return { mse, bias, variance };
}
