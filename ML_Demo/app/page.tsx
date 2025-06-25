"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import RegressionDemo from "@/components/regression-demo"
import ClassificationDemo from "@/components/classification-demo"

export default function MLDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Machine Learning Interactive Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore regression and classification by drawing your own models and understanding bias-variance tradeoffs
          </p>
        </div>

        <Tabs defaultValue="regression" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-16 p-1 bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl">
            <TabsTrigger
              value="regression"
              className="text-lg font-semibold py-4 px-8 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-blue-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📈</span>
                <span>Linear Regression</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="classification"
              className="text-lg font-semibold py-4 px-8 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-purple-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <span>Classification</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="regression">
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="flex items-center justify-center gap-3 text-2xl text-blue-700">
                  <span className="text-3xl">📈</span>
                  Linear Regression Demo
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Draw a curve to fit the training data (blue points). Complex curves may overfit and show high variance
                  when evaluated on test data. Experiment with different curve complexities!
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center">
                <RegressionDemo />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classification">
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="flex items-center justify-center gap-3 text-2xl text-purple-700">
                  <span className="text-3xl">🎯</span>
                  Binary Classification Demo
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Draw a curved boundary to separate the positive (green) and negative (red) classes. Complex boundaries
                  may overfit to training data and perform poorly on new examples.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center">
                <ClassificationDemo />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
