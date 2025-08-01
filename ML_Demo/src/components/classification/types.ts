import type { DataPoint } from '@/components/line-learner/types';

export interface ClassificationDataPoint extends DataPoint {
  class: 'A' | 'B';
}
