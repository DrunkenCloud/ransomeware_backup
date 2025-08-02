import { useMemo } from 'react';
import type {
  GridData,
  NetworkState,
  HiddenNode1,
  HiddenNode2,
  OutputNode,
  ActivatedHiddenNode1,
  ActivatedHiddenNode2,
  ProbabilisticOutputNode,
} from './types';

export const GRID_SIZE = 10;

export const createEmptyGrid = (): GridData => {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(false));
};

export const initialNetworkState: NetworkState = {
  inputGrid: createEmptyGrid(),
  hiddenLayer1: [
    { id: 'hl1-1', label: 'Vertical Line Detector', pattern: createEmptyGrid().map((row, y) => row.map((_, x) => x === 4)) }
  ],
  hiddenLayer2: [
    { id: 'hl2-1', label: 'Feature Combiner', connections: ['hl1-1']}
  ],
  outputLayer: [
    { id: 'out-1', label: 'Class 1', connections: ['hl2-1']}
  ],
};

// --- Calculation Logic ---

const calculateActivationHL1 = (inputGrid: GridData, node: HiddenNode1): number => {
  let matches = 0;
  let patternActivePixels = 0;

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (node.pattern[y][x]) {
        patternActivePixels++;
        if (inputGrid[y][x]) {
          matches++;
        }
      }
    }
  }

  if (patternActivePixels === 0) return 0;
  
  return (matches / patternActivePixels) * 100;
};

const calculateActivationHL2 = (
  connectedNodes: ActivatedHiddenNode1[],
): number => {
  if (connectedNodes.length === 0) return 0;
  const totalActivation = connectedNodes.reduce(
    (sum, node) => sum + node.activation,
    0
  );
  return totalActivation / connectedNodes.length;
};

const calculateProbabilities = (
  allH2Nodes: ActivatedHiddenNode2[],
  outputNodes: OutputNode[]
): ProbabilisticOutputNode[] => {
  const nodeScores = outputNodes.map(node => {
    const connectedNodes = allH2Nodes.filter(h2Node => node.connections.includes(h2Node.id));
    const score = connectedNodes.reduce((sum, h2Node) => sum + h2Node.activation, 0);
    return { ...node, score };
  });

  const totalScore = nodeScores.reduce((sum, node) => sum + node.score, 0);

  if (totalScore === 0) {
    const numNodes = outputNodes.length;
    const equalProb = numNodes > 0 ? 100 / numNodes : 100;
    return outputNodes.map(node => ({ ...node, probability: numNodes > 0 ? equalProb : 0 }));
  }

  return nodeScores.map(node => ({
    ...node,
    probability: (node.score / totalScore) * 100,
  }));
};

// --- Custom Hook for Memoized Calculation ---

export const useNetworkCalculations = (networkState: NetworkState) => {
  const activatedH1Nodes = useMemo(
    () =>
      networkState.hiddenLayer1.map(node => ({
        ...node,
        activation: calculateActivationHL1(networkState.inputGrid, node),
      })),
    [networkState.inputGrid, networkState.hiddenLayer1]
  );

  const activatedH2Nodes = useMemo(
    () =>
      networkState.hiddenLayer2.map(node => {
        const connectedNodes = activatedH1Nodes.filter(h1Node =>
          node.connections.includes(h1Node.id)
        );
        return {
          ...node,
          activation: calculateActivationHL2(connectedNodes),
        };
      }),
    [activatedH1Nodes, networkState.hiddenLayer2]
  );

  const probabilisticOutputNodes = useMemo(
    () => calculateProbabilities(activatedH2Nodes, networkState.outputLayer),
    [activatedH2Nodes, networkState.outputLayer]
  );

  return {
    activatedH1Nodes,
    activatedH2Nodes,
    probabilisticOutputNodes,
  };
};
