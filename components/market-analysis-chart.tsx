"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface MarketAnalysisChartProps {
  predictedPrice: number
  neighborhoodAverage: number
  cityAverage: number
}

export function MarketAnalysisChart({ predictedPrice, neighborhoodAverage, cityAverage }: MarketAnalysisChartProps) {
  const chartData = [
    {
      category: "Seu Imóvel",
      value: predictedPrice,
      fill: "hsl(var(--chart-1))",
    },
    {
      category: "Média do Bairro",
      value: neighborhoodAverage,
      fill: "hsl(var(--chart-2))",
    },
    {
      category: "Média da Cidade",
      value: cityAverage,
      fill: "hsl(var(--chart-3))",
    },
  ]

  const chartConfig = {
    value: {
      label: "Valor",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparação de Mercado</CardTitle>
        <CardDescription>Veja como seu imóvel se compara com a média da região</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              angle={-15}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(1)}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(value as number)
                  }
                />
              }
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
