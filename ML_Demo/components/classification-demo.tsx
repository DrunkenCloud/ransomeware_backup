"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Point {
  x: number
  y: number
  label: number // 1 for positive, -1 for negative
}

interface CurvePoint {
  x: number
  y: number
}

interface Curve {
  points: CurvePoint[]
}

export default function ClassificationDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [trainPoints, setTrainPoints] = useState<Point[]>([])
  const [testPoints, setTestPoints] = useState<Point[]>([])
  const [userCurve, setUserCurve] = useState<Curve | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<CurvePoint[]>([])
  const [metrics, setMetrics] = useState<{
    trainAccuracy: number
    testAccuracy: number
    trainCorrect: number
    trainTotal: number
    testCorrect: number
    testTotal: number
  } | null>(null)

  const GRID_SIZE = 20
  const CANVAS_SIZE = 600

  const generatePoints = useCallback(() => {
    const points: Point[] = []

    // Create two clusters for better separation
    for (let i = 0; i < 15; i++) {
      let x, y, label

      if (Math.random() < 0.5) {
        // Positive class (upper right region)
        x = 0.3 + Math.random() * 0.6
        y = 0.3 + Math.random() * 0.6
        label = 1
      } else {
        // Negative class (lower left region)
        x = 0.1 + Math.random() * 0.6
        y = 0.1 + Math.random() * 0.6
        label = -1
      }

      // Add some noise to make it more realistic
      if (Math.random() < 0.2) {
        label *= -1 // Flip some labels for noise
      }

      points.push({
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y)),
        label,
      })
    }

    setTrainPoints(points)
    setTestPoints([])
    setUserCurve(null)
    setMetrics(null)
  }, [])

  const generateTestPoints = useCallback(() => {
    const points: Point[] = []

    for (let i = 0; i < 5; i++) {
      let x, y, label

      if (Math.random() < 0.5) {
        // Positive class
        x = 0.3 + Math.random() * 0.6
        y = 0.3 + Math.random() * 0.6
        label = 1
      } else {
        // Negative class
        x = 0.1 + Math.random() * 0.6
        y = 0.1 + Math.random() * 0.6
        label = -1
      }

      // Add some noise
      if (Math.random() < 0.2) {
        label *= -1
      }

      points.push({
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y)),
        label,
      })
    }

    setTestPoints(points)
  }, [])

  const classifyPoint = useCallback((point: Point, curve: Curve): number => {
    if (curve.points.length === 0) return 1
    if (curve.points.length === 1) {
      return point.y > curve.points[0].y ? 1 : -1
    }

    // Check if point is "above" the curve by finding closest curve segment
    let minDistance = Number.POSITIVE_INFINITY
    let isAbove = true

    for (let i = 0; i < curve.points.length - 1; i++) {
      const p1 = curve.points[i]
      const p2 = curve.points[i + 1]

      // Find closest point on line segment to our point
      const A = point.x - p1.x
      const B = point.y - p1.y
      const C = p2.x - p1.x
      const D = p2.y - p1.y

      const dot = A * C + B * D
      const lenSq = C * C + D * D

      const param = lenSq !== 0 ? dot / lenSq : -1

      let xx, yy
      if (param < 0) {
        xx = p1.x
        yy = p1.y
      } else if (param > 1) {
        xx = p2.x
        yy = p2.y
      } else {
        xx = p1.x + param * C
        yy = p1.y + param * D
      }

      const distance = Math.sqrt((point.x - xx) ** 2 + (point.y - yy) ** 2)

      if (distance < minDistance) {
        minDistance = distance
        isAbove = point.y > yy
      }
    }

    return isAbove ? 1 : -1
  }, [])

  const calculateMetrics = useCallback(
    (curve: Curve, trainPts: Point[], testPts: Point[]) => {
      // Calculate training accuracy
      const trainCorrect = trainPts.reduce((correct, point) => {
        const predicted = classifyPoint(point, curve)
        return correct + (predicted === point.label ? 1 : 0)
      }, 0)
      const trainAccuracy = trainCorrect / trainPts.length

      // Calculate test accuracy
      const testCorrect = testPts.reduce((correct, point) => {
        const predicted = classifyPoint(point, curve)
        return correct + (predicted === point.label ? 1 : 0)
      }, 0)
      const testAccuracy = testPts.length > 0 ? testCorrect / testPts.length : 0

      return {
        trainAccuracy,
        testAccuracy,
        trainCorrect,
        trainTotal: trainPts.length,
        testCorrect,
        testTotal: testPts.length,
      }
    },
    [classifyPoint],
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

    // Draw training points
    trainPoints.forEach((point) => {
      ctx.fillStyle = point.label === 1 ? "#22c55e" : "#ef4444"
      ctx.beginPath()
      ctx.arc(point.x * CANVAS_SIZE, (1 - point.y) * CANVAS_SIZE, 6, 0, 2 * Math.PI)
      ctx.fill()

      // Add border for training points
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 2
      ctx.stroke()
    })

    // Draw test points (with different style)
    testPoints.forEach((point) => {
      ctx.fillStyle = point.label === 1 ? "#22c55e" : "#ef4444"
      ctx.beginPath()
      ctx.arc(point.x * CANVAS_SIZE, (1 - point.y) * CANVAS_SIZE, 8, 0, 2 * Math.PI)
      ctx.fill()

      // Add white border for test points
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 1
      ctx.stroke()
    })

    // Draw user curve
    if (userCurve && userCurve.points.length > 1) {
      ctx.strokeStyle = "#8b5cf6"
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
      ctx.strokeStyle = "#8b5cf6"
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

    setUserCurve({ points: currentPath })
    setIsDrawing(false)
    setCurrentPath([])

    // Generate test points if they don't exist
    if (testPoints.length === 0) {
      generateTestPoints()
    }
  }

  useEffect(() => {
    if (userCurve && trainPoints.length > 0) {
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
                Click and drag to draw a boundary separating green (+) and red (-) points. Test points will appear with
                white borders to evaluate your classifier.
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
                🟢 Positive Class
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                🔴 Negative Class
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 text-sm py-2 px-4">🟣 Decision Boundary</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {metrics && (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-xl text-purple-800">📊 Classification Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center p-4 bg-white/80 rounded-xl shadow-md">
                    <div className="text-4xl font-bold text-blue-600">{(metrics.trainAccuracy * 100).toFixed(1)}%</div>
                    <div className="text-sm text-gray-600 font-medium">Training Accuracy</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {metrics.trainCorrect}/{metrics.trainTotal} correct
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-xl shadow-md">
                    <div className="text-4xl font-bold text-orange-600">
                      {testPoints.length > 0 ? (metrics.testAccuracy * 100).toFixed(1) : "0.0"}%
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Test Accuracy</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {metrics.testCorrect}/{metrics.testTotal} correct
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/60 rounded-xl">
                  <h4 className="font-semibold mb-3 text-gray-800">🔍 Performance Analysis:</h4>
                  <div className="text-sm space-y-2 text-gray-600">
                    {metrics.testAccuracy > metrics.trainAccuracy && (
                      <p className="text-green-600 font-medium">
                        ✅ Excellent generalization - test accuracy exceeds training!
                      </p>
                    )}
                    {metrics.testAccuracy < metrics.trainAccuracy - 0.1 && (
                      <p className="text-yellow-600 font-medium">
                        ⚠️ Possible overfitting - test accuracy much lower than training
                      </p>
                    )}
                    {Math.abs(metrics.testAccuracy - metrics.trainAccuracy) <= 0.1 && (
                      <p className="text-blue-600 font-medium">
                        👍 Balanced performance - similar train and test accuracy
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-white/60 rounded-xl">
                  <h4 className="font-semibold mb-3 text-gray-800">📚 Understanding Classification:</h4>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li>
                      <strong>Decision Boundary:</strong> Your purple line separates classes
                    </li>
                    <li>
                      <strong>Training Accuracy:</strong> Performance on known data
                    </li>
                    <li>
                      <strong>Test Accuracy:</strong> Performance on new, unseen data
                    </li>
                    <li>
                      <strong>Generalization:</strong> How well the model works on new data
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {userCurve && (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-50 to-gray-100">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">🎨 Your Decision Boundary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="font-mono text-sm bg-white/80 p-4 rounded-xl shadow-sm">
                    Curved boundary with {userCurve.points.length} points
                  </div>
                  <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    💡 <strong>Tip:</strong> Complex boundaries may overfit to training data
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
