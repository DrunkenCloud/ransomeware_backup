"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Point {
  x: number
  y: number
}

interface CurvePoint {
  x: number
  y: number
}

interface Curve {
  points: CurvePoint[]
}

export default function RegressionDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [trainPoints, setTrainPoints] = useState<Point[]>([])
  const [testPoints, setTestPoints] = useState<Point[]>([])
  const [userCurve, setUserCurve] = useState<Curve | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<CurvePoint[]>([])
  const [metrics, setMetrics] = useState<{
    trainMSE: number
    testMSE: number
    bias: number
    variance: number
  } | null>(null)

  const GRID_SIZE = 20
  const CANVAS_SIZE = 600

  const generatePoints = useCallback(() => {
    // Generate training points with some underlying pattern + noise
    const points: Point[] = []
    const trueSlope = 0.5
    const trueIntercept = 0.3

    for (let i = 0; i < 15; i++) {
      const x = Math.random()
      const y = trueSlope * x + trueIntercept + (Math.random() - 0.5) * 0.3
      points.push({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) })
    }

    setTrainPoints(points)
    setTestPoints([])
    setUserCurve(null)
    setMetrics(null)
  }, [])

  const generateTestPoints = useCallback(() => {
    const points: Point[] = []
    const trueSlope = 0.5
    const trueIntercept = 0.3

    for (let i = 0; i < 5; i++) {
      const x = Math.random()
      const y = trueSlope * x + trueIntercept + (Math.random() - 0.5) * 0.3
      points.push({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) })
    }

    setTestPoints(points)
  }, [])

  const predictY = useCallback((x: number, curve: Curve): number => {
    if (curve.points.length === 0) return 0
    if (curve.points.length === 1) return curve.points[0].y

    // Find the two points that x falls between
    let leftPoint = curve.points[0]
    let rightPoint = curve.points[curve.points.length - 1]

    for (let i = 0; i < curve.points.length - 1; i++) {
      if (x >= curve.points[i].x && x <= curve.points[i + 1].x) {
        leftPoint = curve.points[i]
        rightPoint = curve.points[i + 1]
        break
      }
    }

    // Linear interpolation between the two points
    if (Math.abs(rightPoint.x - leftPoint.x) < 0.001) {
      return leftPoint.y
    }

    const t = (x - leftPoint.x) / (rightPoint.x - leftPoint.x)
    return leftPoint.y + t * (rightPoint.y - leftPoint.y)
  }, [])

  const calculateMetrics = useCallback(
    (curve: Curve, trainPts: Point[], testPts: Point[]) => {
      // Calculate MSE for training data
      const trainMSE =
        trainPts.reduce((sum, point) => {
          const predicted = predictY(point.x, curve)
          return sum + Math.pow(point.y - predicted, 2)
        }, 0) / trainPts.length

      // Calculate MSE for test data
      const testMSE =
        testPts.reduce((sum, point) => {
          const predicted = predictY(point.x, curve)
          return sum + Math.pow(point.y - predicted, 2)
        }, 0) / testPts.length

      // Calculate complexity (variance indicator) - more points = more complex
      const complexity = curve.points.length / 20 // Normalize by max expected points

      // Calculate smoothness (another variance indicator)
      let totalCurvature = 0
      for (let i = 1; i < curve.points.length - 1; i++) {
        const p1 = curve.points[i - 1]
        const p2 = curve.points[i]
        const p3 = curve.points[i + 1]

        // Calculate angle change (curvature)
        const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x)
        const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x)
        totalCurvature += Math.abs(angle2 - angle1)
      }

      const avgCurvature = curve.points.length > 2 ? totalCurvature / (curve.points.length - 2) : 0

      // Bias: how far from a simple linear relationship
      const bias = avgCurvature * 0.5 + complexity * 0.3

      // Variance: how much test error exceeds train error, plus complexity penalty
      const variance = Math.max(0, testMSE - trainMSE) + complexity * 0.1

      return { trainMSE, testMSE, bias, variance }
    },
    [predictY],
  )

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Draw grid
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    for (let i = 0; i <= GRID_SIZE; i++) {
      const pos = (i / GRID_SIZE) * CANVAS_SIZE
      ctx.beginPath()
      ctx.moveTo(pos, 0)
      ctx.lineTo(pos, CANVAS_SIZE)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, pos)
      ctx.lineTo(CANVAS_SIZE, pos)
      ctx.stroke()
    }

    // Draw training points (blue)
    trainPoints.forEach((point) => {
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.arc(point.x * CANVAS_SIZE, (1 - point.y) * CANVAS_SIZE, 6, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw test points (orange)
    testPoints.forEach((point) => {
      ctx.fillStyle = "#f97316"
      ctx.beginPath()
      ctx.arc(point.x * CANVAS_SIZE, (1 - point.y) * CANVAS_SIZE, 6, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw user curve
    if (userCurve && userCurve.points.length > 1) {
      ctx.strokeStyle = "#dc2626"
      ctx.lineWidth = 3
      ctx.beginPath()

      const points = userCurve.points
      ctx.moveTo(points[0].x * CANVAS_SIZE, (1 - points[0].y) * CANVAS_SIZE)

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x * CANVAS_SIZE, (1 - points[i].y) * CANVAS_SIZE)
      }

      ctx.stroke()
    }

    // Draw current path while drawing
    if (isDrawing && currentPath.length > 1) {
      ctx.strokeStyle = "#dc2626"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()

      ctx.moveTo(currentPath[0].x * CANVAS_SIZE, (1 - currentPath[0].y) * CANVAS_SIZE)
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x * CANVAS_SIZE, (1 - currentPath[i].y) * CANVAS_SIZE)
      }

      ctx.stroke()
      ctx.setLineDash([])
    }
  }, [trainPoints, testPoints, userCurve, isDrawing, currentPath])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  useEffect(() => {
    generatePoints()
  }, [generatePoints])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / CANVAS_SIZE
    const y = 1 - (e.clientY - rect.top) / CANVAS_SIZE

    setIsDrawing(true)
    setCurrentPath([{ x, y }])
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / CANVAS_SIZE
    const y = 1 - (e.clientY - rect.top) / CANVAS_SIZE

    setCurrentPath((prev) => [...prev, { x, y }])
  }

  const handleMouseUp = () => {
    if (!isDrawing || currentPath.length < 2) return

    // Sort points by x coordinate and remove duplicates
    const sortedPoints = currentPath
      .sort((a, b) => a.x - b.x)
      .filter((point, index, arr) => index === 0 || Math.abs(point.x - arr[index - 1].x) > 0.01)

    setUserCurve({ points: sortedPoints })
    setIsDrawing(false)
    setCurrentPath([])

    // Generate test points if they don't exist
    if (testPoints.length === 0) {
      generateTestPoints()
    }
  }

  useEffect(() => {
    if (userCurve && testPoints.length > 0) {
      const newMetrics = calculateMetrics(userCurve, trainPoints, testPoints)
      setMetrics(newMetrics)
    }
  }, [userCurve, testPoints, trainPoints, calculateMetrics])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={generatePoints}
              variant="outline"
              size="lg"
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              🔄 Generate New Data
            </Button>
            <Button
              onClick={generateTestPoints}
              disabled={!userCurve}
              variant="outline"
              size="lg"
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              🧪 Generate Test Points
            </Button>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive Canvas</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Click and drag to draw a curve through the blue training points. Test points (orange) will appear to
                evaluate your model's performance.
              </p>
            </div>

            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="border-2 border-gray-200 rounded-xl cursor-crosshair shadow-lg hover:shadow-xl transition-shadow bg-white"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              />
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <Badge variant="secondary" className="text-sm py-2 px-4">
                🔵 Training Data
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                🟠 Test Data
              </Badge>
              <Badge variant="destructive" className="text-sm py-2 px-4">
                📏 Your Curve
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {metrics && (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-xl text-blue-800">📊 Model Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center p-4 bg-white/80 rounded-xl shadow-md">
                    <div className="text-3xl font-bold text-blue-600">{metrics.trainMSE.toFixed(4)}</div>
                    <div className="text-sm text-gray-600 font-medium">Training MSE</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-xl shadow-md">
                    <div className="text-3xl font-bold text-orange-600">{metrics.testMSE.toFixed(4)}</div>
                    <div className="text-sm text-gray-600 font-medium">Test MSE</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center p-4 bg-white/80 rounded-xl shadow-md">
                    <div className="text-3xl font-bold text-red-600">{metrics.bias.toFixed(4)}</div>
                    <div className="text-sm text-gray-600 font-medium">Bias</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-xl shadow-md">
                    <div className="text-3xl font-bold text-purple-600">{metrics.variance.toFixed(4)}</div>
                    <div className="text-sm text-gray-600 font-medium">Variance</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/60 rounded-xl">
                  <h4 className="font-semibold mb-3 text-gray-800">📚 Understanding the Metrics:</h4>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li>
                      <strong>Training MSE:</strong> Error on training data
                    </li>
                    <li>
                      <strong>Test MSE:</strong> Error on unseen test data
                    </li>
                    <li>
                      <strong>Bias:</strong> How far your model is from the true relationship
                    </li>
                    <li>
                      <strong>Variance:</strong> How much performance degrades on new data
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {userCurve && (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-50 to-gray-100">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">🎨 Your Model</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="font-mono text-sm bg-white/80 p-4 rounded-xl shadow-sm">
                    Curve with {userCurve.points.length} control points
                  </div>
                  <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    💡 <strong>Tip:</strong> More complex curves may overfit to training data
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
