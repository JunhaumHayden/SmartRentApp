"""
SmartRent ML Model - Rent Price Prediction
Carrega e utiliza o modelo treinado (modelo_3_regressao_linear.pkl)
"""

import json
import sys
import pickle
import pandas as pd
import os

def load_trained_model():
    """
    Carrega o modelo treinado do arquivo pickle.
    """
    model_path = os.path.join(os.path.dirname(__file__), 'modelo_3_regressao_linear.pkl')
    
    try:
        with open(model_path, 'rb') as arquivo:
            modelo_carregado = pickle.load(arquivo)
        return modelo_carregado
    except FileNotFoundError:
        print(json.dumps({
            'error': f'Modelo não encontrado em {model_path}. Por favor, adicione o arquivo modelo_3_regressao_linear.pkl no diretório scripts/'
        }), file=sys.stderr)
        return None
    except Exception as e:
        print(json.dumps({
            'error': f'Erro ao carregar modelo: {str(e)}'
        }), file=sys.stderr)
        return None

def map_property_to_features(property_data):
    """
    Mapeia os dados do formulário para as features esperadas pelo modelo.
    Features do modelo:
    - const: 1
    - area_primeiro_andar: área em m²
    - existe_segundo_andar: 0 ou 1
    - quantidade_banheiros: número
    - qualidade_da_cozinha_Excelente: 0 ou 1
    """
    area = float(property_data.get('area', 0))
    bathrooms = int(property_data.get('bathrooms', 1))
    bedrooms = int(property_data.get('bedrooms', 1))
    
    # Inferir se existe segundo andar baseado no número de quartos
    # Assumindo que casas com 3+ quartos geralmente têm segundo andar
    existe_segundo_andar = 1 if bedrooms >= 3 else 0
    
    # Inferir qualidade da cozinha baseado em outras características
    # Se tem elevador, piscina ou segurança, provavelmente tem cozinha excelente
    has_elevator = property_data.get('hasElevator') == 'yes'
    has_pool = property_data.get('hasPool') == 'yes'
    has_security = property_data.get('hasSecurity') == 'yes'
    
    qualidade_cozinha_excelente = 1 if (has_elevator or has_pool or has_security) else 0
    
    # Criar DataFrame com as features na ordem correta
    features_df = pd.DataFrame({
        'const': [1],
        'area_primeiro_andar': [area],
        'existe_segundo_andar': [existe_segundo_andar],
        'quantidade_banheiros': [bathrooms],
        'qualidade_da_cozinha_Excelente': [qualidade_cozinha_excelente]
    })
    
    return features_df

def predict_rent_price(property_data, modelo):
    """
    Faz a previsão usando o modelo treinado.
    """
    if modelo is None:
        # Fallback para modelo simplificado se o modelo real não estiver disponível
        return predict_rent_price_fallback(property_data)
    
    features_df = map_property_to_features(property_data)
    
    try:
        # Fazer previsão usando o modelo carregado
        predicted_price = modelo.predict(features_df)[0]
        
        # Garantir que o preço seja positivo
        predicted_price = max(predicted_price, 500)
        
        # Calcular intervalo de confiança (±10%)
        confidence_min = predicted_price * 0.90
        confidence_max = predicted_price * 1.10
        
        return {
            'predicted_price': round(predicted_price, 2),
            'confidence_interval': {
                'min': round(confidence_min, 2),
                'max': round(confidence_max, 2)
            },
            'model_version': 'modelo_3_regressao_linear',
            'features_used': features_df.to_dict('records')[0]
        }
    except Exception as e:
        print(json.dumps({
            'error': f'Erro na previsão: {str(e)}'
        }), file=sys.stderr)
        return predict_rent_price_fallback(property_data)

def predict_rent_price_fallback(property_data):
    """
    Modelo simplificado de fallback caso o modelo treinado não esteja disponível.
    """
    area = float(property_data.get('area', 0))
    bedrooms = int(property_data.get('bedrooms', 0))
    bathrooms = int(property_data.get('bathrooms', 0))
    parking_spaces = int(property_data.get('parkingSpaces', 0))
    
    has_elevator = 1 if property_data.get('hasElevator') == 'yes' else 0
    has_pool = 1 if property_data.get('hasPool') == 'yes' else 0
    has_security = 1 if property_data.get('hasSecurity') == 'yes' else 0
    
    furnished_multiplier = 1.0
    if property_data.get('furnished') == 'yes':
        furnished_multiplier = 1.15
    elif property_data.get('furnished') == 'partial':
        furnished_multiplier = 1.08
    
    property_type_multipliers = {
        'apartment': 1.0,
        'house': 1.1,
        'condo': 1.2,
        'studio': 0.85
    }
    property_type = property_data.get('propertyType', 'apartment')
    type_multiplier = property_type_multipliers.get(property_type, 1.0)
    
    base_price = 1000
    area_contribution = area * 18
    bedroom_contribution = bedrooms * 400
    bathroom_contribution = bathrooms * 250
    parking_contribution = parking_spaces * 300
    elevator_contribution = has_elevator * 200
    pool_contribution = has_pool * 150
    security_contribution = has_security * 180
    
    predicted_price = (
        base_price +
        area_contribution +
        bedroom_contribution +
        bathroom_contribution +
        parking_contribution +
        elevator_contribution +
        pool_contribution +
        security_contribution
    ) * type_multiplier * furnished_multiplier
    
    confidence_min = predicted_price * 0.90
    confidence_max = predicted_price * 1.10
    
    return {
        'predicted_price': round(predicted_price, 2),
        'confidence_interval': {
            'min': round(confidence_min, 2),
            'max': round(confidence_max, 2)
        },
        'model_version': 'v1.0-fallback'
    }

def calculate_market_comparison(property_data, predicted_price):
    """
    Simula dados de comparação de mercado.
    """
    neighborhood_avg = predicted_price * 0.95
    city_avg = predicted_price * 0.88
    
    return {
        'predicted': predicted_price,
        'neighborhood_average': round(neighborhood_avg, 2),
        'city_average': round(city_avg, 2),
        'percentile': 65,
        'similar_properties': [
            {
                'price': round(predicted_price * 0.92, 2),
                'area': float(property_data.get('area', 0)) - 5,
                'bedrooms': int(property_data.get('bedrooms', 0))
            },
            {
                'price': round(predicted_price * 1.05, 2),
                'area': float(property_data.get('area', 0)) + 8,
                'bedrooms': int(property_data.get('bedrooms', 0))
            },
            {
                'price': round(predicted_price * 0.98, 2),
                'area': float(property_data.get('area', 0)) + 2,
                'bedrooms': int(property_data.get('bedrooms', 0))
            }
        ]
    }

def generate_optimization_suggestions(property_data, predicted_price):
    """
    Gera sugestões para aumentar o valor do aluguel.
    """
    suggestions = []
    
    if property_data.get('hasElevator') == 'no':
        suggestions.append({
            'feature': 'Elevador',
            'impact': 'high',
            'price_increase': 200,
            'description': 'Adicionar elevador pode aumentar o valor em até R$ 200/mês',
            'roi_months': 120
        })
    
    if property_data.get('hasPool') == 'no':
        suggestions.append({
            'feature': 'Piscina',
            'impact': 'medium',
            'price_increase': 150,
            'description': 'Piscina no condomínio pode aumentar o valor em até R$ 150/mês',
            'roi_months': 80
        })
    
    if property_data.get('hasSecurity') == 'no':
        suggestions.append({
            'feature': 'Segurança 24h',
            'impact': 'high',
            'price_increase': 180,
            'description': 'Segurança 24h aumenta o valor e a atratividade do imóvel',
            'roi_months': 36
        })
    
    if property_data.get('furnished') == 'no':
        suggestions.append({
            'feature': 'Mobília',
            'impact': 'high',
            'price_increase': round(predicted_price * 0.15, 2),
            'description': 'Mobiliar o imóvel pode aumentar o valor em até 15%',
            'roi_months': 24
        })
    
    if int(property_data.get('parkingSpaces', 0)) == 0:
        suggestions.append({
            'feature': 'Vaga de Garagem',
            'impact': 'high',
            'price_increase': 300,
            'description': 'Adicionar vaga de garagem pode aumentar significativamente o valor',
            'roi_months': 60
        })
    
    # Sugestão para melhorar a cozinha
    bedrooms = int(property_data.get('bedrooms', 1))
    if bedrooms < 3:
        suggestions.append({
            'feature': 'Reforma da Cozinha',
            'impact': 'medium',
            'price_increase': round(predicted_price * 0.08, 2),
            'description': 'Reformar a cozinha para qualidade excelente pode aumentar o valor em até 8%',
            'roi_months': 18
        })
    
    suggestions.sort(key=lambda x: x['price_increase'], reverse=True)
    return suggestions[:5]

if __name__ == '__main__':
    modelo = load_trained_model()
    
    # Ler dados do imóvel do stdin
    input_data = sys.stdin.read()
    property_data = json.loads(input_data)
    
    # Fazer previsão
    prediction_result = predict_rent_price(property_data, modelo)
    
    # Obter comparação de mercado
    market_data = calculate_market_comparison(property_data, prediction_result['predicted_price'])
    
    # Gerar sugestões
    suggestions = generate_optimization_suggestions(property_data, prediction_result['predicted_price'])
    
    # Combinar resultados
    result = {
        'prediction': prediction_result,
        'market_analysis': market_data,
        'optimization_suggestions': suggestions
    }
    
    # Retornar resultado em JSON
    print(json.dumps(result, ensure_ascii=False))
