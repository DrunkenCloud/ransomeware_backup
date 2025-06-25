"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample training data
const trainingData = [
  { age: 25, income: 30000, education: "High School", previousPurchases: 0, outcome: "No" },
  { age: 35, income: 50000, education: "Bachelor", previousPurchases: 2, outcome: "Yes" },
  { age: 45, income: 70000, education: "Master", previousPurchases: 5, outcome: "Yes" },
  { age: 22, income: 25000, education: "High School", previousPurchases: 0, outcome: "No" },
  { age: 38, income: 60000, education: "Bachelor", previousPurchases: 3, outcome: "Yes" },
  { age: 28, income: 40000, education: "Bachelor", previousPurchases: 1, outcome: "No" },
  { age: 50, income: 80000, education: "Master", previousPurchases: 7, outcome: "Yes" },
  { age: 30, income: 45000, education: "Bachelor", previousPurchases: 2, outcome: "Yes" },
  { age: 26, income: 35000, education: "High School", previousPurchases: 1, outcome: "No" },
  { age: 42, income: 65000, education: "Master", previousPurchases: 4, outcome: "Yes" },
  { age: 33, income: 55000, education: "Bachelor", previousPurchases: 3, outcome: "Yes" },
  { age: 24, income: 28000, education: "High School", previousPurchases: 0, outcome: "No" },
  { age: 47, income: 75000, education: "Master", previousPurchases: 6, outcome: "Yes" },
  { age: 29, income: 42000, education: "Bachelor", previousPurchases: 1, outcome: "No" },
  { age: 36, income: 58000, education: "Bachelor", previousPurchases: 4, outcome: "Yes" },
]

// Test data
const testData = [
  { age: 31, income: 48000, education: "Bachelor", previousPurchases: 2, outcome: "Yes" },
  { age: 27, income: 32000, education: "High School", previousPurchases: 0, outcome: "No" },
  { age: 44, income: 68000, education: "Master", previousPurchases: 5, outcome: "Yes" },
  { age: 23, income: 26000, education: "High School", previousPurchases: 1, outcome: "No" },
  { age: 39, income: 62000, education: "Bachelor", previousPurchases: 3, outcome: "Yes" },
]

interface TreeNode {
  id: string
  type: "decision" | "leaf"
  column?: string
  condition?: string
  value?: string | number
  classification?: string
  left?: TreeNode
  right?: TreeNode
}

export default function DecisionTreeBuilder() {
  const [tree, setTree] = useState<TreeNode>({
    id: "root",
    type: "decision",
  })
  const [selectedNode, setSelectedNode] = useState<string>("root")
  const [testResults, setTestResults] = useState<any[]>([])
  const [accuracy, setAccuracy] = useState<number | null>(null)

  const columns = ["age", "income", "education", "previousPurchases"]
  const conditions = [">=", "<", "==", "!="]

  const updateNode = (nodeId: string, updates: Partial<TreeNode>) => {
    const updateNodeRecursive = (node: TreeNode): TreeNode => {
      if (node.id === nodeId) {
        return { ...node, ...updates }
      }
      return {
        ...node,
        left: node.left ? updateNodeRecursive(node.left) : undefined,
        right: node.right ? updateNodeRecursive(node.right) : undefined,
      }
    }
    setTree(updateNodeRecursive(tree))
  }

  const addChildNode = (parentId: string, side: "left" | "right") => {
    const newNodeId = `${parentId}_${side}_${Date.now()}`
    const newNode: TreeNode = {
      id: newNodeId,
      type: "leaf",
      classification: "Yes",
    }

    updateNode(parentId, { [side]: newNode })
  }

  const evaluateNode = (node: TreeNode, data: any): string => {
    if (node.type === "leaf") {
      return node.classification || "Unknown"
    }

    if (!node.column || !node.condition || node.value === undefined) {
      return "Unknown"
    }

    const dataValue = data[node.column]
    let conditionMet = false

    switch (node.condition) {
      case ">=":
        conditionMet = dataValue >= node.value
        break
      case "<":
        conditionMet = dataValue < node.value
        break
      case "==":
        conditionMet = dataValue == node.value
        break
      case "!=":
        conditionMet = dataValue != node.value
        break
    }

    const nextNode = conditionMet ? node.left : node.right
    if (!nextNode) return "Unknown"

    return evaluateNode(nextNode, data)
  }

  const testDecisionTree = () => {
    const results = testData.map((data) => {
      const prediction = evaluateNode(tree, data)
      return {
        ...data,
        prediction,
        correct: prediction === data.outcome,
      }
    })

    const correctPredictions = results.filter((r) => r.correct).length
    const accuracyPercent = (correctPredictions / results.length) * 100

    setTestResults(results)
    setAccuracy(accuracyPercent)
  }

  const renderNode = (node: TreeNode, depth = 0): JSX.Element => {
    const isSelected = selectedNode === node.id

    return (
      <div key={node.id} className="flex flex-col items-center relative">
        <Card
          className={`w-48 cursor-pointer transition-colors z-10 relative ${
            isSelected ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
          }`}
          onClick={() => setSelectedNode(node.id)}
        >
          <CardContent className="p-3 text-center">
            {node.type === "decision" ? (
              <div>
                <Badge variant="outline" className="mb-2">
                  Decision
                </Badge>
                {node.column && node.condition && node.value !== undefined ? (
                  <p className="text-sm">
                    {node.column} {node.condition} {node.value}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Not configured</p>
                )}
              </div>
            ) : (
              <div>
                <Badge variant="secondary" className="mb-2">
                  Leaf
                </Badge>
                <p className="text-sm font-medium">{node.classification}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {node.type === "decision" && (
          <div className="relative">
            {/* Vertical line down from parent */}
            <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-gray-300 transform -translate-x-0.5"></div>

            {/* Horizontal line connecting children */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-300"></div>

            <div className="flex mt-8 space-x-8 relative">
              <div className="flex flex-col items-center relative">
                {/* Vertical line down to left child */}
                <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-gray-300 transform -translate-x-0.5"></div>

                <div className="text-xs text-green-600 mb-2 mt-4">True</div>
                {node.left ? (
                  renderNode(node.left, depth + 1)
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addChildNode(node.id, "left")}
                    className="w-24 h-16 border-dashed"
                  >
                    Add Node
                  </Button>
                )}
              </div>

              <div className="flex flex-col items-center relative">
                {/* Vertical line down to right child */}
                <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-gray-300 transform -translate-x-0.5"></div>

                <div className="text-xs text-red-600 mb-2 mt-4">False</div>
                {node.right ? (
                  renderNode(node.right, depth + 1)
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addChildNode(node.id, "right")}
                    className="w-24 h-16 border-dashed"
                  >
                    Add Node
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const selectedNodeData = (() => {
    const findNode = (node: TreeNode): TreeNode | null => {
      if (node.id === selectedNode) return node
      if (node.left) {
        const found = findNode(node.left)
        if (found) return found
      }
      if (node.right) {
        const found = findNode(node.right)
        if (found) return found
      }
      return null
    }
    return findNode(tree)
  })()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Decision Tree Builder</h1>
          <p className="text-gray-600 mt-2">Build and test your own decision tree classifier</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Training Data */}
          <Card>
            <CardHeader>
              <CardTitle>Training Data</CardTitle>
              <CardDescription>Customer data for building the decision tree</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white">
                    <TableRow>
                      <TableHead>Age</TableHead>
                      <TableHead>Income</TableHead>
                      <TableHead>Education</TableHead>
                      <TableHead>Purchases</TableHead>
                      <TableHead>Outcome</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainingData.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.age}</TableCell>
                        <TableCell>${row.income.toLocaleString()}</TableCell>
                        <TableCell>{row.education}</TableCell>
                        <TableCell>{row.previousPurchases}</TableCell>
                        <TableCell>
                          <Badge variant={row.outcome === "Yes" ? "default" : "secondary"}>{row.outcome}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="text-xs text-gray-500 mt-2 sticky bottom-0 bg-white pt-2">Showing all 15 records</p>
              </div>
            </CardContent>
          </Card>

          {/* Node Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Node Configuration</CardTitle>
              <CardDescription>Configure the selected node</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedNodeData && (
                <>
                  <div>
                    <Label>Node Type</Label>
                    <Select
                      value={selectedNodeData.type}
                      onValueChange={(value: "decision" | "leaf") => updateNode(selectedNode, { type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="decision">Decision Node</SelectItem>
                        <SelectItem value="leaf">Leaf Node</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedNodeData.type === "decision" ? (
                    <>
                      <div>
                        <Label>Column</Label>
                        <Select
                          value={selectedNodeData.column || ""}
                          onValueChange={(value) => updateNode(selectedNode, { column: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select column" />
                          </SelectTrigger>
                          <SelectContent>
                            {columns.map((col) => (
                              <SelectItem key={col} value={col}>
                                {col}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Condition</Label>
                        <Select
                          value={selectedNodeData.condition || ""}
                          onValueChange={(value) => updateNode(selectedNode, { condition: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {conditions.map((cond) => (
                              <SelectItem key={cond} value={cond}>
                                {cond}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Value</Label>
                        <Input
                          value={selectedNodeData.value || ""}
                          onChange={(e) => {
                            const value =
                              selectedNodeData.column === "education"
                                ? e.target.value
                                : Number(e.target.value) || e.target.value
                            updateNode(selectedNode, { value })
                          }}
                          placeholder="Enter value"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <Label>Classification</Label>
                      <Select
                        value={selectedNodeData.classification || "Yes"}
                        onValueChange={(value) => updateNode(selectedNode, { classification: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Evaluate your decision tree</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={testDecisionTree} className="w-full mb-4">
                Test Decision Tree
              </Button>

              {accuracy !== null && (
                <div className="mb-4">
                  <div className="text-2xl font-bold text-center">{accuracy.toFixed(1)}% Accuracy</div>
                  <div className="text-sm text-gray-600 text-center">
                    {testResults.filter((r) => r.correct).length} out of {testResults.length} correct
                  </div>
                </div>
              )}

              {testResults.length > 0 && (
                <div className="space-y-2">
                  {testResults.map((result, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded text-sm ${
                        result.correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      <div className="font-medium">Test {idx + 1}</div>
                      <div>Predicted: {result.prediction}</div>
                      <div>Actual: {result.outcome}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Decision Tree Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Decision Tree</CardTitle>
            <CardDescription>Click on nodes to select and configure them</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto p-4">{renderNode(tree)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
