import { NextResponse } from "next/server"

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

    // In production, this would call the Python ML model
    // For now, we'll implement the same logic in TypeScript
    const prediction = calculatePrediction(propertyData)
    const marketAnalysis = calculateMarketAnalysis(propertyData, prediction.predicted_price)
    const suggestions = generateSuggestions(propertyData, prediction.predicted_price)

    return NextResponse.json({
      prediction,
      market_analysis: marketAnalysis,
      optimization_suggestions: suggestions,
    })
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Erro ao processar a previsão" }, { status: 500 })
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
