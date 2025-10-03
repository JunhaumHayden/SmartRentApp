"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2, TrendingUp } from "lucide-react"
import { PropertyResults } from "@/components/property-results"
import { useToast } from "@/hooks/use-toast"

interface PropertyData {
  area: string
  bedrooms: string
  bathrooms: string
  parkingSpaces: string
  propertyType: string
  neighborhood: string
  city: string
  hasElevator: string
  hasPool: string
  hasSecurity: string
  furnished: string
  floor: string
}

interface PredictionResponse {
  prediction: {
    predicted_price: number
    confidence_interval: {
      min: number
      max: number
    }
    feature_importance: Record<string, number>
  }
  market_analysis: {
    predicted: number
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

export function PropertyForm() {
  const [formData, setFormData] = useState<PropertyData>({
    area: "",
    bedrooms: "",
    bathrooms: "",
    parkingSpaces: "",
    propertyType: "",
    neighborhood: "",
    city: "",
    hasElevator: "no",
    hasPool: "no",
    hasSecurity: "no",
    furnished: "no",
    floor: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null)
  const { toast } = useToast()

  const handleInputChange = (field: keyof PropertyData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Erro ao processar a previsão")
      }

      const data: PredictionResponse = await response.json()
      setPredictionData(data)
      setShowResults(true)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Erro",
        description: "Não foi possível processar sua solicitação. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.area &&
      formData.bedrooms &&
      formData.bathrooms &&
      formData.parkingSpaces &&
      formData.propertyType &&
      formData.neighborhood &&
      formData.city
    )
  }

  if (showResults && predictionData) {
    return (
      <PropertyResults predictionData={predictionData} propertyData={formData} onReset={() => setShowResults(false)} />
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Informações do Imóvel</CardTitle>
          <CardDescription>Quanto mais detalhes você fornecer, mais precisa será a estimativa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Características Básicas</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area">Área Total (m²) *</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="Ex: 80"
                  value={formData.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyType">Tipo de Imóvel *</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => handleInputChange("propertyType", value)}
                >
                  <SelectTrigger id="propertyType">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                    <SelectItem value="house">Casa</SelectItem>
                    <SelectItem value="condo">Condomínio</SelectItem>
                    <SelectItem value="studio">Kitnet/Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedrooms">Quartos *</Label>
                <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange("bedrooms", value)}>
                  <SelectTrigger id="bedrooms">
                    <SelectValue placeholder="Número de quartos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 quarto</SelectItem>
                    <SelectItem value="2">2 quartos</SelectItem>
                    <SelectItem value="3">3 quartos</SelectItem>
                    <SelectItem value="4">4 quartos</SelectItem>
                    <SelectItem value="5">5+ quartos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Banheiros *</Label>
                <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange("bathrooms", value)}>
                  <SelectTrigger id="bathrooms">
                    <SelectValue placeholder="Número de banheiros" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 banheiro</SelectItem>
                    <SelectItem value="2">2 banheiros</SelectItem>
                    <SelectItem value="3">3 banheiros</SelectItem>
                    <SelectItem value="4">4+ banheiros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parkingSpaces">Vagas de Garagem *</Label>
                <Select
                  value={formData.parkingSpaces}
                  onValueChange={(value) => handleInputChange("parkingSpaces", value)}
                >
                  <SelectTrigger id="parkingSpaces">
                    <SelectValue placeholder="Número de vagas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sem vaga</SelectItem>
                    <SelectItem value="1">1 vaga</SelectItem>
                    <SelectItem value="2">2 vagas</SelectItem>
                    <SelectItem value="3">3+ vagas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor">Andar</Label>
                <Input
                  id="floor"
                  type="number"
                  placeholder="Ex: 5"
                  value={formData.floor}
                  onChange={(e) => handleInputChange("floor", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Localização</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Ex: São Paulo"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input
                  id="neighborhood"
                  type="text"
                  placeholder="Ex: Vila Mariana"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Comodidades</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hasElevator">Elevador</Label>
                <Select value={formData.hasElevator} onValueChange={(value) => handleInputChange("hasElevator", value)}>
                  <SelectTrigger id="hasElevator">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Sim</SelectItem>
                    <SelectItem value="no">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hasPool">Piscina</Label>
                <Select value={formData.hasPool} onValueChange={(value) => handleInputChange("hasPool", value)}>
                  <SelectTrigger id="hasPool">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Sim</SelectItem>
                    <SelectItem value="no">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hasSecurity">Segurança 24h</Label>
                <Select value={formData.hasSecurity} onValueChange={(value) => handleInputChange("hasSecurity", value)}>
                  <SelectTrigger id="hasSecurity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Sim</SelectItem>
                    <SelectItem value="no">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="furnished">Mobiliado</Label>
                <Select value={formData.furnished} onValueChange={(value) => handleInputChange("furnished", value)}>
                  <SelectTrigger id="furnished">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Sim</SelectItem>
                    <SelectItem value="no">Não</SelectItem>
                    <SelectItem value="partial">Parcialmente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full" disabled={!isFormValid() || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analisando dados...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Estimar Valor do Aluguel
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
