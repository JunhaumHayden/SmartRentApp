import { NextResponse } from "next/server"

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || "http://127.0.0.1:8000/predict"
const API_TIMEOUT = 5000 // 5 segundos

export async function POST(request: Request) {
  try {
    const propertyData = await request.json()

    // Validate required fields
    const requiredFields = ["area", "bedrooms", "bathrooms", "parkingSpaces", "propertyType", "neighborhood", "city"]

    for (const field of requiredFields) {
      if (!propertyData[field]) {
        return NextResponse.json({ error: `Campo obrigatório ausente: ${field}` }, { status: 400 })
      }
    }

    console.log("[v0] Tentando consultar API externa...")
    const externalResult = await tryExternalAPI(propertyData)

    if (externalResult.success) {
      console.log("[v0] API externa respondeu com sucesso")
      return NextResponse.json(externalResult.data)
    }

    console.log("[v0] API externa falhou, usando modelo local como fallback:", externalResult.error)
    const prediction = calculatePrediction(propertyData)
    const marketAnalysis = calculateMarketAnalysis(propertyData, prediction.predicted_price)
    const suggestions = generateSuggestions(propertyData, prediction.predicted_price)

    return NextResponse.json({
      prediction,
      market_analysis: marketAnalysis,
      optimization_suggestions: suggestions,
      fallback_used: true, // Indica que usou o modelo local
    })
  } catch (error) {
    console.error("[v0] Prediction error:", error)
    return NextResponse.json({ error: "Erro ao processar a previsão" }, { status: 500 })
  }
}

async function tryExternalAPI(propertyData: any): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // Mapear dados do formulário para o formato da API externa
    const externalPayload = {
      city: propertyData.city,
      neighborhood: propertyData.neighborhood,
      area_first_floor_sqm: Number.parseFloat(propertyData.area),
      has_second_floor: Number.parseInt(propertyData.bedrooms) > 2, // Inferir segundo andar baseado em quartos
      bathrooms: Number.parseInt(propertyData.bathrooms),
      kitchen_quality_excellent: propertyData.furnished === "yes", // Inferir qualidade da cozinha
    }

    console.log("[v0] Payload para API externa:", JSON.stringify(externalPayload))

    // Criar promise com timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

    const response = await fetch(EXTERNAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(externalPayload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`API retornou status ${response.status}`)
    }

    const externalData = await response.json()
    console.log("[v0] Resposta da API externa:", JSON.stringify(externalData))

    // Adaptar resposta da API externa para o formato esperado pelo frontend
    const adaptedData = adaptExternalResponse(externalData, propertyData)

    return { success: true, data: adaptedData }
  } catch (error: any) {
    const errorMessage =
      error.name === "AbortError" ? "Timeout ao conectar com API externa" : error.message || "Erro desconhecido"

    return { success: false, error: errorMessage }
  }
}

function adaptExternalResponse(externalData: any, originalPropertyData: any) {
  const predictedPrice = externalData.price_prediction

  // Converter sugestões da API externa para o formato esperado
  const suggestions = (externalData.suggestions || []).map((suggestion: any) => ({
    feature: suggestion.tip,
    impact: suggestion.value_increase > 300 ? "high" : suggestion.value_increase > 150 ? "medium" : "low",
    price_increase: suggestion.value_increase,
    description: suggestion.reason,
    roi_months: Math.round((suggestion.value_increase * 12) / 100), // Estimativa de ROI
  }))

  return {
    prediction: {
      predicted_price: predictedPrice,
      confidence_interval: {
        min: Math.round(predictedPrice * 0.9 * 100) / 100,
        max: Math.round(predictedPrice * 1.1 * 100) / 100,
      },
      feature_importance: {
        area: Math.round(predictedPrice * 0.4),
        bedrooms: Math.round(predictedPrice * 0.15),
        bathrooms: Math.round(predictedPrice * 0.1),
        parking: Math.round(predictedPrice * 0.1),
      },
      model_version: "external-api",
    },
    market_analysis: calculateMarketAnalysis(originalPropertyData, predictedPrice),
    optimization_suggestions:
      suggestions.length > 0 ? suggestions : generateSuggestions(originalPropertyData, predictedPrice),
  }
}

function calculatePrediction(propertyData: any) {
  const area = Number.parseFloat(propertyData.area)
  const bedrooms = Number.parseInt(propertyData.bedrooms)
  const bathrooms = Number.parseInt(propertyData.bathrooms)
  const parkingSpaces = Number.parseInt(propertyData.parkingSpaces)

  const hasElevator = propertyData.hasElevator === "yes" ? 1 : 0
  const hasPool = propertyData.hasPool === "yes" ? 1 : 0
  const hasSecurity = propertyData.hasSecurity === "yes" ? 1 : 0

  let furnishedMultiplier = 1.0
  if (propertyData.furnished === "yes") furnishedMultiplier = 1.15
  else if (propertyData.furnished === "partial") furnishedMultiplier = 1.08

  const typeMultipliers: Record<string, number> = {
    apartment: 1.0,
    house: 1.1,
    condo: 1.2,
    studio: 0.85,
  }
  const typeMultiplier = typeMultipliers[propertyData.propertyType] || 1.0

  const basePrice = 1000
  const areaContribution = area * 18
  const bedroomContribution = bedrooms * 400
  const bathroomContribution = bathrooms * 250
  const parkingContribution = parkingSpaces * 300
  const elevatorContribution = hasElevator * 200
  const poolContribution = hasPool * 150
  const securityContribution = hasSecurity * 180

  const predictedPrice =
    (basePrice +
      areaContribution +
      bedroomContribution +
      bathroomContribution +
      parkingContribution +
      elevatorContribution +
      poolContribution +
      securityContribution) *
    typeMultiplier *
    furnishedMultiplier

  return {
    predicted_price: Math.round(predictedPrice * 100) / 100,
    confidence_interval: {
      min: Math.round(predictedPrice * 0.9 * 100) / 100,
      max: Math.round(predictedPrice * 1.1 * 100) / 100,
    },
    feature_importance: {
      area: areaContribution,
      bedrooms: bedroomContribution,
      bathrooms: bathroomContribution,
      parking: parkingContribution,
      elevator: elevatorContribution,
      pool: poolContribution,
      security: securityContribution,
    },
    model_version: "v1.0-demo",
  }
}

function calculateMarketAnalysis(propertyData: any, predictedPrice: number) {
  const neighborhoodAvg = predictedPrice * 0.95
  const cityAvg = predictedPrice * 0.88

  return {
    predicted: predictedPrice,
    neighborhood_average: Math.round(neighborhoodAvg * 100) / 100,
    city_average: Math.round(cityAvg * 100) / 100,
    percentile: 65,
    similar_properties: [
      {
        price: Math.round(predictedPrice * 0.92 * 100) / 100,
        area: Number.parseFloat(propertyData.area) - 5,
        bedrooms: Number.parseInt(propertyData.bedrooms),
      },
      {
        price: Math.round(predictedPrice * 1.05 * 100) / 100,
        area: Number.parseFloat(propertyData.area) + 8,
        bedrooms: Number.parseInt(propertyData.bedrooms),
      },
      {
        price: Math.round(predictedPrice * 0.98 * 100) / 100,
        area: Number.parseFloat(propertyData.area) + 2,
        bedrooms: Number.parseInt(propertyData.bedrooms),
      },
    ],
  }
}

function generateSuggestions(propertyData: any, predictedPrice: number) {
  const suggestions = []

  if (propertyData.hasElevator === "no") {
    suggestions.push({
      feature: "Elevador",
      impact: "high",
      price_increase: 200,
      description: "Adicionar elevador pode aumentar o valor em até R$ 200/mês",
      roi_months: 120,
    })
  }

  if (propertyData.hasPool === "no") {
    suggestions.push({
      feature: "Piscina",
      impact: "medium",
      price_increase: 150,
      description: "Piscina no condomínio pode aumentar o valor em até R$ 150/mês",
      roi_months: 80,
    })
  }

  if (propertyData.hasSecurity === "no") {
    suggestions.push({
      feature: "Segurança 24h",
      impact: "high",
      price_increase: 180,
      description: "Segurança 24h aumenta o valor e a atratividade do imóvel",
      roi_months: 36,
    })
  }

  if (propertyData.furnished === "no") {
    suggestions.push({
      feature: "Mobília",
      impact: "high",
      price_increase: Math.round(predictedPrice * 0.15 * 100) / 100,
      description: "Mobiliar o imóvel pode aumentar o valor em até 15%",
      roi_months: 24,
    })
  }

  if (Number.parseInt(propertyData.parkingSpaces) === 0) {
    suggestions.push({
      feature: "Vaga de Garagem",
      impact: "high",
      price_increase: 300,
      description: "Adicionar vaga de garagem pode aumentar significativamente o valor",
      roi_months: 60,
    })
  }

  return suggestions.sort((a, b) => b.price_increase - a.price_increase).slice(0, 5)
}
