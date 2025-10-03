"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PriceDistributionChartProps {
  predictedPrice: number
  confidenceInterval: {
    min: number
    max: number
  }
}

export function PriceDistributionChart({ predictedPrice, confidenceInterval }: PriceDistributionChartProps) {
  // Generate distribution data
  const generateDistribution = () => {
    const data = []
    const step = (confidenceInterval.max - confidenceInterval.min) / 20

    for (let i = 0; i <= 20; i++) {
      const price = confidenceInterval.min + step * i
      // Normal distribution curve
      const distance = Math.abs(price - predictedPrice)
      const maxDistance = confidenceInterval.max - predictedPrice
      const probability = Math.exp(-Math.pow(distance / (maxDistance / 2), 2)) * 100

      data.push({
        price: Math.round(price),
        probability: Math.round(probability),
      })
    }

    return data
  }

  const chartData = generateDistribution()

  const chartConfig = {
    probability: {
      label: "Probabilidade",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Preço</CardTitle>
        <CardDescription>Faixa de confiança da estimativa baseada no modelo</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <defs>
              <linearGradient id="colorProbability" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="price"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(1)}k`}
            />
            <YAxis hide />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    if (name === "probability") {
                      return `${value}% confiança`
                    }
                    return value
                  }}
                  labelFormatter={(label) =>
                    new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(label as number)
                  }
                />
              }
            />
            <Area
              type="monotone"
              dataKey="probability"
              stroke="hsl(var(--chart-1))"
              fill="url(#colorProbability)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>

        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Mínimo</p>
            <p className="font-semibold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(confidenceInterval.min)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Estimado</p>
            <p className="font-semibold text-primary">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(predictedPrice)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Máximo</p>
            <p className="font-semibold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(confidenceInterval.max)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
