"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Home } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MarketAnalysisChart } from "@/components/market-analysis-chart"
import { SimilarPropertiesChart } from "@/components/similar-properties-chart"
import { PriceDistributionChart } from "@/components/price-distribution-chart"
import { MarketInsights } from "@/components/market-insights"
import { OptimizationSuggestions } from "@/components/optimization-suggestions"

interface PropertyResultsProps {
  predictionData: {
    prediction: {
      predicted_price: number
      confidence_interval: {
        min: number
        max: number
      }
    }
    market_analysis: {
      neighborhood_average: number
      city_average: number
      percentile: number
      similar_properties: Array<{
        price: number
        area: number
        bedrooms: number
      }>
    }
    optimization_suggestions: Array<{
      feature: string
      impact: string
      price_increase: number
      description: string
      roi_months: number
    }>
  }
  propertyData: {
    area: string
    bedrooms: string
    bathrooms: string
    parkingSpaces: string
    propertyType: string
    neighborhood: string
    city: string
  }
  onReset: () => void
}

export function PropertyResults({ predictionData, propertyData, onReset }: PropertyResultsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const { prediction, market_analysis, optimization_suggestions } = predictionData

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onReset}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Nova Estimativa
      </Button>

      {/* Main Result Card */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl">Estimativa de Valor</CardTitle>
          <CardDescription>Baseado nas características do seu imóvel e dados do mercado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Valor Estimado Mensal</p>
              <p className="text-5xl font-bold text-primary">{formatCurrency(prediction.predicted_price)}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Faixa de confiança: {formatCurrency(prediction.confidence_interval.min)} -{" "}
                {formatCurrency(prediction.confidence_interval.max)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Imóvel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">
                  {propertyData.neighborhood}, {propertyData.city}
                </p>
                <p className="text-sm text-muted-foreground">Localização</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Home className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="flex flex-wrap gap-2 mb-1">
                  <Badge variant="secondary">{propertyData.area}m²</Badge>
                  <Badge variant="secondary">{propertyData.bedrooms} quartos</Badge>
                  <Badge variant="secondary">{propertyData.bathrooms} banheiros</Badge>
                  <Badge variant="secondary">{propertyData.parkingSpaces} vagas</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Características</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <OptimizationSuggestions suggestions={optimization_suggestions} currentPrice={prediction.predicted_price} />
      {/* </CHANGE> */}

      <div className="grid md:grid-cols-2 gap-6">
        <MarketAnalysisChart
          predictedPrice={prediction.predicted_price}
          neighborhoodAverage={market_analysis.neighborhood_average}
          cityAverage={market_analysis.city_average}
        />

        <PriceDistributionChart
          predictedPrice={prediction.predicted_price}
          confidenceInterval={prediction.confidence_interval}
        />
      </div>

      <MarketInsights
        predictedPrice={prediction.predicted_price}
        neighborhoodAverage={market_analysis.neighborhood_average}
        cityAverage={market_analysis.city_average}
        percentile={market_analysis.percentile}
      />

      <SimilarPropertiesChart
        yourProperty={{
          price: prediction.predicted_price,
          area: Number.parseFloat(propertyData.area),
        }}
        similarProperties={market_analysis.similar_properties}
      />
    </div>
  )
}
