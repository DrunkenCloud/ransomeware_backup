export type GridData = boolean[][];
export type NodeId = string;

export interface BaseNode {
  id: NodeId;
  label: string;
}

export interface HiddenNode1 extends BaseNode {
  pattern: GridData;
}

export interface HiddenNode2 extends BaseNode {
  connections: NodeId[]; // Connects to HiddenNode1 ids
}

export interface OutputNode extends BaseNode {
  connections: NodeId[]; // Connects to HiddenNode2 ids
}

export interface NetworkState {
  inputGrid: GridData;
  hiddenLayer1: HiddenNode1[];
  hiddenLayer2: HiddenNode2[];
  outputLayer: OutputNode[];
}

// These types include calculated values for display
export interface ActivatedHiddenNode1 extends HiddenNode1 {
  activation: number;
}

export interface ActivatedHiddenNode2 extends HiddenNode2 {
  activation: number;
}

export interface ProbabilisticOutputNode extends OutputNode {
  probability: number;
}
