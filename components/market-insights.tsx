"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MarketInsightsProps {
  predictedPrice: number
  neighborhoodAverage: number
  cityAverage: number
  percentile: number
}

export function MarketInsights({ predictedPrice, neighborhoodAverage, cityAverage, percentile }: MarketInsightsProps) {
  const neighborhoodDiff = ((predictedPrice - neighborhoodAverage) / neighborhoodAverage) * 100
  const cityDiff = ((predictedPrice - cityAverage) / cityAverage) * 100

  const getTrendIcon = (diff: number) => {
    if (diff > 2) return <TrendingUp className="w-4 h-4 text-accent" />
    if (diff < -2) return <TrendingDown className="w-4 h-4 text-destructive" />
    return <Minus className="w-4 h-4 text-muted-foreground" />
  }

  const getTrendText = (diff: number) => {
    if (diff > 2) return "acima"
    if (diff < -2) return "abaixo"
    return "na média"
  }

  const getPercentileBadge = (percentile: number) => {
    if (percentile >= 75) return { variant: "default" as const, text: "Alto" }
    if (percentile >= 50) return { variant: "secondary" as const, text: "Médio-Alto" }
    if (percentile >= 25) return { variant: "secondary" as const, text: "Médio" }
    return { variant: "outline" as const, text: "Abaixo da Média" }
  }

  const percentileBadge = getPercentileBadge(percentile)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights de Mercado</CardTitle>
        <CardDescription>Análise detalhada do posicionamento do seu imóvel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Percentile */}
        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Posicionamento no Mercado</p>
            <p className="text-2xl font-bold text-foreground">{percentile}º Percentil</p>
          </div>
          <Badge variant={percentileBadge.variant} className="text-sm">
            {percentileBadge.text}
          </Badge>
        </div>

        {/* Neighborhood Comparison */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Comparação com o Bairro</span>
            {getTrendIcon(neighborhoodDiff)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Seu imóvel está {getTrendText(neighborhoodDiff)} da média do bairro
            </span>
            <span className="text-sm font-semibold">{Math.abs(neighborhoodDiff).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${Math.min(Math.abs(neighborhoodDiff) * 5, 100)}%` }}
            />
          </div>
        </div>

        {/* City Comparison */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Comparação com a Cidade</span>
            {getTrendIcon(cityDiff)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Seu imóvel está {getTrendText(cityDiff)} da média da cidade
            </span>
            <span className="text-sm font-semibold">{Math.abs(cityDiff).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all"
              style={{ width: `${Math.min(Math.abs(cityDiff) * 5, 100)}%` }}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {percentile >= 75
              ? "Seu imóvel está muito bem posicionado no mercado, com preço acima da maioria das propriedades similares."
              : percentile >= 50
                ? "Seu imóvel tem um bom posicionamento no mercado, com preço competitivo na região."
                : "Há oportunidade para otimizar o valor do seu imóvel com melhorias estratégicas."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
