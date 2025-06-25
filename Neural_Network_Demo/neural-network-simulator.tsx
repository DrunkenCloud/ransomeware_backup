"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Brain, Play, RotateCcw, Info, Settings, Eye } from "lucide-react"

// Activation function (sigmoid)
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x))

// Initialize random weights
const initializeWeights = () => {
  const inputToHidden = Array(3)
    .fill(0)
    .map(() =>
      Array(8)
        .fill(0)
        .map(() => (Math.random() - 0.5) * 2),
    )
  const hiddenToOutput = Array(8)
    .fill(0)
    .map(() =>
      Array(2)
        .fill(0)
        .map(() => (Math.random() - 0.5) * 2),
    )
  const hiddenBias = Array(8)
    .fill(0)
    .map(() => (Math.random() - 0.5) * 2)
  const outputBias = Array(2)
    .fill(0)
    .map(() => (Math.random() - 0.5) * 2)

  return { inputToHidden, hiddenToOutput, hiddenBias, outputBias }
}

export default function NeuralNetworkSimulator() {
  const [inputs, setInputs] = useState([0.7, 0.8, 0.85]) // Normalized inputs (0-1)
  const [weights, setWeights] = useState(initializeWeights())
  const [hiddenValues, setHiddenValues] = useState<number[]>([])
  const [outputs, setOutputs] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showWeights, setShowWeights] = useState(false)

  const forwardPropagate = () => {
    setIsAnimating(true)
    setCurrentStep(1)

    // Calculate hidden layer values
    const hidden = weights.hiddenBias.map((bias, i) => {
      const sum = inputs.reduce((acc, input, j) => acc + input * weights.inputToHidden[j][i], 0) + bias
      return sigmoid(sum)
    })

    setTimeout(() => {
      setHiddenValues(hidden)
      setCurrentStep(2)

      // Calculate output layer values
      const output = weights.outputBias.map((bias, i) => {
        const sum = hidden.reduce((acc, hiddenVal, j) => acc + hiddenVal * weights.hiddenToOutput[j][i], 0) + bias
        return sigmoid(sum)
      })

      setTimeout(() => {
        setOutputs(output)
        setCurrentStep(3)
        setIsAnimating(false)
      }, 1000)
    }, 1000)
  }

  const resetNetwork = () => {
    setWeights(initializeWeights())
    setHiddenValues([])
    setOutputs([])
    setCurrentStep(0)
  }

  const updateInputToHiddenWeight = (inputIndex: number, hiddenIndex: number, value: number) => {
    const newWeights = { ...weights }
    newWeights.inputToHidden[inputIndex][hiddenIndex] = value
    setWeights(newWeights)
  }

  const updateHiddenToOutputWeight = (hiddenIndex: number, outputIndex: number, value: number) => {
    const newWeights = { ...weights }
    newWeights.hiddenToOutput[hiddenIndex][outputIndex] = value
    setWeights(newWeights)
  }

  const updateHiddenBias = (index: number, value: number) => {
    const newWeights = { ...weights }
    newWeights.hiddenBias[index] = value
    setWeights(newWeights)
  }

  const updateOutputBias = (index: number, value: number) => {
    const newWeights = { ...weights }
    newWeights.outputBias[index] = value
    setWeights(newWeights)
  }

  const getConnectionOpacity = (fromLayer: number, toLayer: number) => {
    if (!isAnimating) return 0.3
    if (fromLayer === 0 && toLayer === 1 && currentStep >= 1) return 0.8
    if (fromLayer === 1 && toLayer === 2 && currentStep >= 2) return 0.8
    return 0.1
  }

  const getNeuronColor = (layer: number, index: number) => {
    if (!isAnimating) return "bg-blue-100 border-blue-300"

    if (layer === 0) return "bg-green-200 border-green-400"
    if (layer === 1 && currentStep >= 1) {
      const intensity = hiddenValues[index] || 0
      const opacity = Math.min(intensity * 100, 80)
      return `bg-yellow-${opacity > 40 ? "300" : "200"} border-yellow-400`
    }
    if (layer === 2 && currentStep >= 2) {
      const intensity = outputs[index] || 0
      const opacity = Math.min(intensity * 100, 80)
      return `bg-red-${opacity > 40 ? "300" : "200"} border-red-400`
    }

    return "bg-gray-100 border-gray-300"
  }

  const inputLabels = ["Study Hours", "Sleep Hours", "Attendance"]
  const outputLabels = ["Pass", "Fail"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Interactive Neural Network Simulator</h1>
          </div>
          <p className="text-lg text-gray-600">
            Adjust weights and see how they affect student performance predictions
          </p>
        </div>

        <Tabs defaultValue="network" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="network">Network View</TabsTrigger>
            <TabsTrigger value="weights">Weight Controls</TabsTrigger>
          </TabsList>

          <TabsContent value="network" className="space-y-6">
            <div className="flex justify-center gap-4 mb-4">
              <Button onClick={forwardPropagate} disabled={isAnimating} size="lg">
                <Play className="w-4 h-4 mr-2" />
                {isAnimating ? "Processing..." : "Run Forward Propagation"}
              </Button>
              <Button onClick={resetNetwork} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Weights
              </Button>
              <Button onClick={() => setShowWeights(!showWeights)} variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                {showWeights ? "Hide" : "Show"} Weights
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Network Architecture</CardTitle>
                <CardDescription>3 → 8 → 2 fully connected neural network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-[600px] bg-white rounded-lg border p-4 overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 700 500">
                    {/* Connections Input to Hidden */}
                    {Array(3)
                      .fill(0)
                      .map((_, i) =>
                        Array(8)
                          .fill(0)
                          .map((_, j) => (
                            <g key={`input-hidden-${i}-${j}`}>
                              <line
                                x1={120}
                                y1={80 + i * 120}
                                x2={350}
                                y2={50 + j * 50}
                                stroke={weights.inputToHidden[i][j] > 0 ? "#10b981" : "#ef4444"}
                                strokeWidth={Math.abs(weights.inputToHidden[i][j]) * 2 + 0.5}
                                opacity={getConnectionOpacity(0, 1)}
                                className="transition-opacity duration-500"
                              />
                              {showWeights && (
                                <text
                                  x={(120 + 350) / 2}
                                  y={(80 + i * 120 + 50 + j * 50) / 2}
                                  textAnchor="middle"
                                  className="text-xs fill-gray-600 font-mono"
                                  style={{ fontSize: "8px" }}
                                >
                                  {weights.inputToHidden[i][j].toFixed(2)}
                                </text>
                              )}
                            </g>
                          )),
                      )}

                    {/* Connections Hidden to Output */}
                    {Array(8)
                      .fill(0)
                      .map((_, i) =>
                        Array(2)
                          .fill(0)
                          .map((_, j) => (
                            <g key={`hidden-output-${i}-${j}`}>
                              <line
                                x1={350}
                                y1={50 + i * 50}
                                x2={580}
                                y2={140 + j * 120}
                                stroke={weights.hiddenToOutput[i][j] > 0 ? "#10b981" : "#ef4444"}
                                strokeWidth={Math.abs(weights.hiddenToOutput[i][j]) * 2 + 0.5}
                                opacity={getConnectionOpacity(1, 2)}
                                className="transition-opacity duration-500"
                              />
                              {showWeights && (
                                <text
                                  x={(350 + 580) / 2}
                                  y={(50 + i * 50 + 140 + j * 120) / 2}
                                  textAnchor="middle"
                                  className="text-xs fill-gray-600 font-mono"
                                  style={{ fontSize: "8px" }}
                                >
                                  {weights.hiddenToOutput[i][j].toFixed(2)}
                                </text>
                              )}
                            </g>
                          )),
                      )}

                    {/* Input Layer Neurons */}
                    {inputLabels.map((label, i) => (
                      <g key={`input-${i}`}>
                        <circle
                          cx={120}
                          cy={80 + i * 120}
                          r={25}
                          className={`${getNeuronColor(0, i)} transition-colors duration-500`}
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <text
                          x={120}
                          y={80 + i * 120 + 5}
                          textAnchor="middle"
                          className="text-xs font-medium fill-white"
                        >
                          {inputs[i].toFixed(3)}
                        </text>
                        <text x={120} y={80 + i * 120 - 35} textAnchor="middle" className="text-xs fill-gray-600">
                          {label}
                        </text>
                      </g>
                    ))}

                    {/* Hidden Layer Neurons */}
                    {Array(8)
                      .fill(0)
                      .map((_, i) => (
                        <g key={`hidden-${i}`}>
                          <circle
                            cx={350}
                            cy={50 + i * 50}
                            r={18}
                            className={`${getNeuronColor(1, i)} transition-colors duration-500`}
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <text
                            x={350}
                            y={50 + i * 50 + 4}
                            textAnchor="middle"
                            className="text-xs font-medium fill-white"
                          >
                            {hiddenValues[i] ? hiddenValues[i].toFixed(3) : "?"}
                          </text>
                        </g>
                      ))}

                    {/* Output Layer Neurons */}
                    {outputLabels.map((label, i) => (
                      <g key={`output-${i}`}>
                        <circle
                          cx={580}
                          cy={140 + i * 120}
                          r={25}
                          className={`${getNeuronColor(2, i)} transition-colors duration-500`}
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <text
                          x={580}
                          y={140 + i * 120 + 5}
                          textAnchor="middle"
                          className="text-xs font-medium fill-white"
                        >
                          {outputs[i] ? outputs[i].toFixed(3) : "?"}
                        </text>
                        <text x={580} y={140 + i * 120 - 35} textAnchor="middle" className="text-xs fill-gray-600">
                          {label}
                        </text>
                      </g>
                    ))}

                    {/* Layer Labels */}
                    <text x={120} y={460} textAnchor="middle" className="text-sm font-semibold fill-gray-700">
                      Input Layer
                    </text>
                    <text x={350} y={460} textAnchor="middle" className="text-sm font-semibold fill-gray-700">
                      Hidden Layer
                    </text>
                    <text x={580} y={460} textAnchor="middle" className="text-sm font-semibold fill-gray-700">
                      Output Layer
                    </text>
                  </svg>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  Input Layer Controls
                </CardTitle>
                <CardDescription>Adjust student characteristics (normalized 0-1)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Study Hours per Day (normalized): {inputs[0].toFixed(3)}</Label>
                  <p className="text-xs text-gray-600 mb-2">0 = 0 hours, 1 = 12+ hours</p>
                  <Slider
                    value={[inputs[0]]}
                    onValueChange={(value) => setInputs([value[0], inputs[1], inputs[2]])}
                    max={1}
                    min={0}
                    step={0.01}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Sleep Hours per Night (normalized): {inputs[1].toFixed(3)}</Label>
                  <p className="text-xs text-gray-600 mb-2">0 = 4 hours, 1 = 12+ hours</p>
                  <Slider
                    value={[inputs[1]]}
                    onValueChange={(value) => setInputs([inputs[0], value[0], inputs[2]])}
                    max={1}
                    min={0}
                    step={0.01}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Attendance Rate (normalized): {inputs[2].toFixed(3)}</Label>
                  <p className="text-xs text-gray-600 mb-2">0 = 0%, 1 = 100%</p>
                  <Slider
                    value={[inputs[2]]}
                    onValueChange={(value) => setInputs([inputs[0], inputs[1], value[0]])}
                    max={1}
                    min={0}
                    step={0.01}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Prediction Results</CardTitle>
                <CardDescription>Based on current inputs and weights</CardDescription>
              </CardHeader>
              <CardContent>
                {outputs.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Pass Probability:</span>
                      <Badge variant={outputs[0] > 0.5 ? "default" : "secondary"} className="text-lg px-3 py-1">
                        {(outputs[0] * 100).toFixed(2)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Fail Probability:</span>
                      <Badge variant={outputs[1] > 0.5 ? "destructive" : "secondary"} className="text-lg px-3 py-1">
                        {(outputs[1] * 100).toFixed(2)}%
                      </Badge>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-blue-800 font-medium">
                            Prediction:{" "}
                            {outputs[0] > outputs[1] ? "Student will likely PASS" : "Student will likely FAIL"}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Raw values: Pass = {outputs[0].toFixed(4)}, Fail = {outputs[1].toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Click "Run Forward Propagation" to see results</p>
                )}
              </CardContent>
            </Card>

          </TabsContent>

          <TabsContent value="weights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Biases - moved above weights */}
              <Card>
                <CardHeader>
                  <CardTitle>Hidden Layer Biases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Array(8)
                      .fill(0)
                      .map((_, i) => (
                        <div key={`hidden-bias-${i}`} className="space-y-1">
                          <Label className="text-xs">H{i + 1} Bias</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[weights.hiddenBias[i]]}
                              onValueChange={(value) => updateHiddenBias(i, value[0])}
                              min={-3}
                              max={3}
                              step={0.1}
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              value={weights.hiddenBias[i].toFixed(2)}
                              onChange={(e) => updateHiddenBias(i, Number.parseFloat(e.target.value) || 0)}
                              className="w-16 h-8 text-xs"
                              step={0.1}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Output Layer Biases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {outputLabels.map((label, i) => (
                      <div key={`output-bias-${i}`} className="space-y-1">
                        <Label className="text-sm">{label} Bias</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[weights.outputBias[i]]}
                            onValueChange={(value) => updateOutputBias(i, value[0])}
                            min={-3}
                            max={3}
                            step={0.1}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={weights.outputBias[i].toFixed(2)}
                            onChange={(e) => updateOutputBias(i, Number.parseFloat(e.target.value) || 0)}
                            className="w-20 h-8 text-xs"
                            step={0.1}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Input to Hidden Weights - moved below biases */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Input → Hidden Weights
                  </CardTitle>
                  <CardDescription>Adjust weights between input and hidden layer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inputLabels.map((inputLabel, i) => (
                    <div key={`input-${i}`} className="space-y-2">
                      <Label className="font-medium text-sm">{inputLabel} connections:</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {Array(8)
                          .fill(0)
                          .map((_, j) => (
                            <div key={`weight-${i}-${j}`} className="space-y-1">
                              <Label className="text-xs text-gray-600">→ H{j + 1}</Label>
                              <div className="flex items-center gap-2">
                                <Slider
                                  value={[weights.inputToHidden[i][j]]}
                                  onValueChange={(value) => updateInputToHiddenWeight(i, j, value[0])}
                                  min={-3}
                                  max={3}
                                  step={0.1}
                                  className="flex-1"
                                />
                                <Input
                                  type="number"
                                  value={weights.inputToHidden[i][j].toFixed(2)}
                                  onChange={(e) =>
                                    updateInputToHiddenWeight(i, j, Number.parseFloat(e.target.value) || 0)
                                  }
                                  className="w-16 h-8 text-xs"
                                  step={0.1}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Hidden to Output Weights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Hidden → Output Weights
                  </CardTitle>
                  <CardDescription>Adjust weights between hidden and output layer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {outputLabels.map((outputLabel, j) => (
                    <div key={`output-${j}`} className="space-y-2">
                      <Label className="font-medium text-sm">→ {outputLabel} connections:</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {Array(8)
                          .fill(0)
                          .map((_, i) => (
                            <div key={`weight-${i}-${j}`} className="space-y-1">
                              <Label className="text-xs text-gray-600">H{i + 1} →</Label>
                              <div className="flex items-center gap-2">
                                <Slider
                                  value={[weights.hiddenToOutput[i][j]]}
                                  onValueChange={(value) => updateHiddenToOutputWeight(i, j, value[0])}
                                  min={-3}
                                  max={3}
                                  step={0.1}
                                  className="flex-1"
                                />
                                <Input
                                  type="number"
                                  value={weights.hiddenToOutput[i][j].toFixed(2)}
                                  onChange={(e) =>
                                    updateHiddenToOutputWeight(i, j, Number.parseFloat(e.target.value) || 0)
                                  }
                                  className="w-16 h-8 text-xs"
                                  step={0.1}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Educational Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Understanding Weights and Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Positive Weights (Green)</h4>
                <p className="text-green-700">
                  Positive weights strengthen the connection. Higher input values will increase the receiving neuron's
                  activation. Thicker lines indicate stronger weights.
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Negative Weights (Red)</h4>
                <p className="text-red-700">
                  Negative weights inhibit the connection. Higher input values will decrease the receiving neuron's
                  activation. This creates opposing influences in the network.
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Biases</h4>
                <p className="text-blue-700">
                  Biases shift the activation function. Positive bias makes neurons more likely to activate, negative
                  bias makes them less likely to activate.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Decimal Precision</h4>
                <p className="text-purple-700">
                  All values are shown with decimal precision to demonstrate how small weight changes can significantly
                  impact the network's behavior and predictions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
