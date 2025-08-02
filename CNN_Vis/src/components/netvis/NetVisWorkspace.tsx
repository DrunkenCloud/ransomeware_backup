"use client";

import React, { useReducer } from 'react';
import { initialNetworkState, useNetworkCalculations, createEmptyGrid } from '@/lib/network';
import type { NetworkState, NodeId } from '@/lib/types';
import Layer from './Layer';
import PixelGrid from './PixelGrid';
import NodeCard from './NodeCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Settings2, Layers, Combine, FileOutput, Edit, ArrowRight, RotateCcw } from 'lucide-react';
import { produce } from 'immer';
import { Card } from '@/components/ui/card';

type Action =
  | { type: 'TOGGLE_INPUT_PIXEL'; payload: { x: number; y: number } }
  | { type: 'ACTIVATE_INPUT_PIXEL'; payload: { x: number; y: number } }
  | { type: 'SET_INPUT_GRID'; payload: { grid: boolean[][] } }
  | { type: 'TOGGLE_PATTERN_PIXEL'; payload: { nodeId: NodeId; x: number; y: number } }
  | { type: 'ACTIVATE_PATTERN_PIXEL'; payload: { nodeId: NodeId; x: number; y: number } }
  | { type: 'SET_PATTERN_GRID'; payload: { nodeId: NodeId; grid: boolean[][] } }
  | { type: 'ADD_NODE'; payload: { layer: keyof Omit<NetworkState, 'inputGrid'> } }
  | { type: 'REMOVE_NODE'; payload: { layer: keyof Omit<NetworkState, 'inputGrid'>; nodeId: NodeId } }
  | { type: 'UPDATE_LABEL'; payload: { layer: keyof Omit<NetworkState, 'inputGrid'>; nodeId: NodeId; label: string } }
  | { type: 'UPDATE_CONNECTIONS'; payload: { layer: 'hiddenLayer2' | 'outputLayer'; nodeId: NodeId; connectionId: NodeId; isConnected: boolean } };


const networkReducer = produce((draft: NetworkState, action: Action) => {
  switch (action.type) {
    case 'TOGGLE_INPUT_PIXEL':
      draft.inputGrid[action.payload.y][action.payload.x] = !draft.inputGrid[action.payload.y][action.payload.x];
      break;
    case 'ACTIVATE_INPUT_PIXEL':
      draft.inputGrid[action.payload.y][action.payload.x] = true;
      break;
    case 'SET_INPUT_GRID':
      draft.inputGrid = action.payload.grid;
      break;
    case 'ADD_NODE':
      const newId = `${action.payload.layer}-${Date.now()}`;
      const newNode = { id: newId, label: `Node ${draft[action.payload.layer].length + 1}` };
      if (action.payload.layer === 'hiddenLayer1') {
        draft.hiddenLayer1.push({ ...newNode, pattern: createEmptyGrid() });
      } else {
        draft[action.payload.layer].push({ ...newNode, connections: [] });
      }
      break;
    case 'REMOVE_NODE':
      const { layer, nodeId } = action.payload;
      (draft[layer] as any[]) = draft[layer].filter(node => node.id !== nodeId);
      if (layer === 'hiddenLayer1') {
        draft.hiddenLayer2.forEach(node => {
          node.connections = node.connections.filter(c => c !== nodeId);
        });
      }
      if (layer === 'hiddenLayer2') {
        draft.outputLayer.forEach(node => {
          node.connections = node.connections.filter(c => c !== nodeId);
        });
      }
      break;
    case 'UPDATE_LABEL':
       const nodeToUpdate = (draft[action.payload.layer] as any[]).find(n => n.id === action.payload.nodeId);
       if(nodeToUpdate) nodeToUpdate.label = action.payload.label;
      break;
    case 'TOGGLE_PATTERN_PIXEL':
      const hl1Node = draft.hiddenLayer1.find(n => n.id === action.payload.nodeId);
      if (hl1Node) {
        hl1Node.pattern[action.payload.y][action.payload.x] = !hl1Node.pattern[action.payload.y][action.payload.x];
      }
      break;
    case 'ACTIVATE_PATTERN_PIXEL':
        const hl1NodeToActivate = draft.hiddenLayer1.find(n => n.id === action.payload.nodeId);
        if (hl1NodeToActivate) {
          hl1NodeToActivate.pattern[action.payload.y][action.payload.x] = true;
        }
        break;
    case 'SET_PATTERN_GRID':
        const hl1NodeToSet = draft.hiddenLayer1.find(n => n.id === action.payload.nodeId);
        if (hl1NodeToSet) {
          hl1NodeToSet.pattern = action.payload.grid;
        }
        break;
    case 'UPDATE_CONNECTIONS':
        const targetNode = (draft[action.payload.layer] as any[]).find(n => n.id === action.payload.nodeId);
        if(targetNode) {
            if(action.payload.isConnected) {
                targetNode.connections.push(action.payload.connectionId);
            } else {
                targetNode.connections = targetNode.connections.filter((id: string) => id !== action.payload.connectionId);
            }
        }
        break;
  }
});


export default function NetVisWorkspace() {
  const [networkState, dispatch] = useReducer(networkReducer, initialNetworkState);
  const { activatedH1Nodes, activatedH2Nodes, probabilisticOutputNodes } = useNetworkCalculations(networkState);

  const renderConnectionPopover = (
      nodeId: NodeId, 
      layer: 'hiddenLayer2' | 'outputLayer', 
      connections: NodeId[],
      availableNodes: {id: NodeId, label: string}[],
      title: string
  ) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Settings2 className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="grid gap-4">
          <p className="font-medium">{title}</p>
          <div className="grid gap-2 max-h-48 overflow-y-auto">
            {availableNodes.map(prevNode => (
              <div key={prevNode.id} className="flex items-center space-x-2">
                <Checkbox id={`conn-${nodeId}-${prevNode.id}`} checked={connections.includes(prevNode.id)} onCheckedChange={(checked) => dispatch({ type: 'UPDATE_CONNECTIONS', payload: { layer, nodeId, connectionId: prevNode.id, isConnected: !!checked }})} />
                <Label htmlFor={`conn-${nodeId}-${prevNode.id}`} className="text-sm font-normal">{prevNode.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-start justify-center gap-4 xl:gap-8">
        
        <Layer title="Input Image Pixels Layer">
          <Dialog>
            <DialogTrigger asChild>
              <Card className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent/10 transition-colors h-auto aspect-square">
                <div className="w-full h-full p-2">
                  <PixelGrid gridData={networkState.inputGrid} onPixelToggle={() => {}} onPixelActivate={() => {}} isReadOnly={true}/>
                </div>
                <p className="font-semibold mt-2">Input Grid</p>
                <p className="text-sm text-muted-foreground">Click to edit</p>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Input Grid</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <PixelGrid 
                    gridData={networkState.inputGrid} 
                    onPixelToggle={(x, y) => dispatch({ type: 'TOGGLE_INPUT_PIXEL', payload: { x, y } })}
                    onPixelActivate={(x, y) => dispatch({ type: 'ACTIVATE_INPUT_PIXEL', payload: { x, y }})}
                />
              </div>
              <DialogFooter>
                  <Button variant="outline" onClick={() => dispatch({type: 'SET_INPUT_GRID', payload: {grid: createEmptyGrid()}})}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                  </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Layer>

        <div className="flex items-center justify-center self-center pt-12 text-muted-foreground">
          <ArrowRight className="w-8 h-8 hidden md:block" />
        </div>

        <Layer title="Hidden Layer 1" icon={<Layers className="w-5 h-5" />} onAddNode={() => dispatch({type: 'ADD_NODE', payload: {layer: 'hiddenLayer1'}})}>
            {activatedH1Nodes.map(node => (
                <NodeCard key={node.id} title={node.label} onLabelChange={(label) => dispatch({type: 'UPDATE_LABEL', payload: {layer: 'hiddenLayer1', nodeId: node.id, label }})} onDelete={() => dispatch({type: 'REMOVE_NODE', payload: {layer: 'hiddenLayer1', nodeId: node.id}})}>
                   <div className="space-y-2">
                     <div className="flex justify-between items-center">
                       <Label>Activation: {node.activation.toFixed(0)}%</Label>
                       <Dialog>
                         <DialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="w-4 h-4" /></Button>
                         </DialogTrigger>
                         <DialogContent className="max-w-md">
                            <DialogHeader><DialogTitle>Edit Pattern for {node.label}</DialogTitle></DialogHeader>
                            <div className="p-4">
                                <PixelGrid 
                                    gridData={node.pattern} 
                                    onPixelToggle={(x, y) => dispatch({type: 'TOGGLE_PATTERN_PIXEL', payload: {nodeId: node.id, x, y}})}
                                    onPixelActivate={(x, y) => dispatch({type: 'ACTIVATE_PATTERN_PIXEL', payload: {nodeId: node.id, x, y}})}
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => dispatch({type: 'SET_PATTERN_GRID', payload: {nodeId: node.id, grid: createEmptyGrid()}})}>
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Reset
                                </Button>
                            </DialogFooter>
                         </DialogContent>
                       </Dialog>
                     </div>
                     <Progress value={node.activation} className="w-full" />
                   </div>
                </NodeCard>
            ))}
        </Layer>
        
        <div className="flex items-center justify-center self-center pt-12 text-muted-foreground">
          <ArrowRight className="w-8 h-8 hidden md:block" />
        </div>

        <Layer title="Hidden Layer 2" icon={<Combine className="w-5 h-5" />} onAddNode={() => dispatch({type: 'ADD_NODE', payload: {layer: 'hiddenLayer2'}})}>
            {activatedH2Nodes.map(node => (
                <NodeCard key={node.id} title={node.label} onLabelChange={(label) => dispatch({type: 'UPDATE_LABEL', payload: {layer: 'hiddenLayer2', nodeId: node.id, label }})} onDelete={() => dispatch({type: 'REMOVE_NODE', payload: {layer: 'hiddenLayer2', nodeId: node.id}})}
                 actions={renderConnectionPopover(node.id, 'hiddenLayer2', node.connections, networkState.hiddenLayer1, 'Connections to Layer 1')}>
                   <div className="space-y-2">
                    <Label>Avg. Activation: {node.activation.toFixed(0)}%</Label>
                    <Progress value={node.activation} className="w-full" />
                   </div>
                </NodeCard>
            ))}
        </Layer>
        
        <div className="flex items-center justify-center self-center pt-12 text-muted-foreground">
          <ArrowRight className="w-8 h-8 hidden md:block" />
        </div>

        <Layer title="Output Layer" icon={<FileOutput className="w-5 h-5" />} onAddNode={() => dispatch({type: 'ADD_NODE', payload: {layer: 'outputLayer'}})}>
            {probabilisticOutputNodes.map(node => (
                 <NodeCard key={node.id} title={node.label} onLabelChange={(label) => dispatch({type: 'UPDATE_LABEL', payload: {layer: 'outputLayer', nodeId: node.id, label }})} onDelete={() => dispatch({type: 'REMOVE_NODE', payload: {layer: 'outputLayer', nodeId: node.id}})}
                  actions={renderConnectionPopover(node.id, 'outputLayer', node.connections, networkState.hiddenLayer2, 'Connections to Layer 2')}>
                   <div className="space-y-2">
                     <Label>Probability: {node.probability.toFixed(0)}%</Label>
                     <Progress value={node.probability} className="w-full" />
                   </div>
                </NodeCard>
            ))}
        </Layer>
      </div>
    </div>
  );
}
