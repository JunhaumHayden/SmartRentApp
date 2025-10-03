"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Clock, DollarSign, ChevronDown, ChevronUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Suggestion {
  feature: string
  impact: string
  price_increase: number
  description: string
  roi_months: number
}

interface OptimizationSuggestionsProps {
  suggestions: Suggestion[]
  currentPrice: number
}

export function OptimizationSuggestions({ suggestions, currentPrice }: OptimizationSuggestionsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(new Set())

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-accent text-white"
      case "medium":
        return "bg-warning text-white"
      case "low":
        return "bg-muted-foreground text-white"
      default:
        return "bg-secondary"
    }
  }

  const getImpactText = (impact: string) => {
    switch (impact) {
      case "high":
        return "Alto Impacto"
      case "medium":
        return "Médio Impacto"
      case "low":
        return "Baixo Impacto"
      default:
        return "Impacto"
    }
  }

  const toggleSuggestion = (index: number) => {
    const newSelected = new Set(selectedSuggestions)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedSuggestions(newSelected)
  }

  const calculateTotalIncrease = () => {
    return Array.from(selectedSuggestions).reduce((total, index) => {
      return total + suggestions[index].price_increase
    }, 0)
  }

  const calculateAverageROI = () => {
    if (selectedSuggestions.size === 0) return 0
    const totalROI = Array.from(selectedSuggestions).reduce((total, index) => {
      return total + suggestions[index].roi_months
    }, 0)
    return Math.round(totalROI / selectedSuggestions.size)
  }

  const totalIncrease = calculateTotalIncrease()
  const averageROI = calculateAverageROI()
  const newPrice = currentPrice + totalIncrease
  const percentageIncrease = ((totalIncrease / currentPrice) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle>Sugestões de Otimização</CardTitle>
          </div>
          <CardDescription>Descubra como aumentar o valor do seu aluguel com melhorias estratégicas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`border rounded-lg transition-all ${
                selectedSuggestions.has(index) ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">{suggestion.feature}</h4>
                      <Badge className={getImpactColor(suggestion.impact)}>{getImpactText(suggestion.impact)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-accent" />
                        <span className="text-muted-foreground">Aumento:</span>
                        <span className="font-semibold text-accent">
                          {formatCurrency(suggestion.price_increase)}/mês
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">ROI:</span>
                        <span className="font-semibold">{suggestion.roi_months} meses</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant={selectedSuggestions.has(index) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSuggestion(index)}
                    >
                      {selectedSuggestions.has(index) ? "Selecionado" : "Selecionar"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    >
                      {expandedIndex === index ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedIndex === index && (
                  <div className="mt-4 pt-4 border-t border-border space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Análise de Retorno</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Aumento Anual</p>
                          <p className="text-lg font-bold text-foreground">
                            {formatCurrency(suggestion.price_increase * 12)}
                          </p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Payback</p>
                          <p className="text-lg font-bold text-foreground">{suggestion.roi_months} meses</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Impacto no Valor</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Valor Atual</span>
                          <span className="font-semibold">{formatCurrency(currentPrice)}</span>
                        </div>
                        <Progress value={100} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Valor com Melhoria</span>
                          <span className="font-semibold text-accent">
                            {formatCurrency(currentPrice + suggestion.price_increase)}
                          </span>
                        </div>
                        <Progress value={100 + (suggestion.price_increase / currentPrice) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedSuggestions.size > 0 && (
        <Card className="border-accent bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-accent" />
              Potencial de Otimização
            </CardTitle>
            <CardDescription>Impacto combinado das melhorias selecionadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-background rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Valor Atual</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(currentPrice)}</p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-accent">
                <p className="text-sm text-muted-foreground mb-1">Aumento Total</p>
                <p className="text-2xl font-bold text-accent">+{formatCurrency(totalIncrease)}</p>
                <p className="text-xs text-muted-foreground mt-1">+{percentageIncrease}%</p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Novo Valor</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(newPrice)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Melhorias Selecionadas</span>
                <span className="font-semibold">{selectedSuggestions.size}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ROI Médio</span>
                <span className="font-semibold">{averageROI} meses</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Retorno Anual Adicional</span>
                <span className="font-semibold text-accent">{formatCurrency(totalIncrease * 12)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Implementando as {selectedSuggestions.size} melhorias selecionadas, você pode aumentar o valor do seu
                aluguel em {percentageIncrease}%, gerando um retorno adicional de {formatCurrency(totalIncrease * 12)}{" "}
                por ano.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
