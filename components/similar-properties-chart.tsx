"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface SimilarPropertiesChartProps {
  yourProperty: {
    price: number
    area: number
  }
  similarProperties: Array<{
    price: number
    area: number
    bedrooms: number
  }>
}

export function SimilarPropertiesChart({ yourProperty, similarProperties }: SimilarPropertiesChartProps) {
  const chartData = [
    {
      name: "Seu Imóvel",
      price: yourProperty.price,
      area: Number.parseFloat(yourProperty.area.toString()),
      fill: "hsl(var(--chart-1))",
    },
    ...similarProperties.map((prop, index) => ({
      name: `Similar ${index + 1}`,
      price: prop.price,
      area: prop.area,
      fill: "hsl(var(--chart-2))",
    })),
  ]

  const chartConfig = {
    price: {
      label: "Preço",
    },
    area: {
      label: "Área",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imóveis Similares</CardTitle>
        <CardDescription>Comparação com propriedades semelhantes na região</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(1)}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    if (name === "price") {
                      return new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(value as number)
                    }
                    return `${value}m²`
                  }}
                />
              }
            />
            <Bar dataKey="price" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {chartData.map((property, index) => (
            <div key={index} className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">{property.name}</p>
              <p className="text-sm font-semibold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(property.price)}
              </p>
              <p className="text-xs text-muted-foreground">{property.area}m²</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
