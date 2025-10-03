# 🐳 Executar SmartRent Estimator com Docker

## Pré-requisitos

- Docker instalado ([Download Docker](https://www.docker.com/products/docker-desktop))
- Docker Compose instalado (geralmente vem com Docker Desktop)

## Opção 1: Usando Docker Compose (Recomendado)

### 1. Navegue até o diretório do projeto
```bash
cd smartrent-estimator
```

### 2. Certifique-se de que o modelo ML está no lugar correto
```bash
# O arquivo deve estar em:
# scripts/modelo_3_regressao_linear.pkl
ls scripts/modelo_3_regressao_linear.pkl
```

### 3. Execute o projeto
```bash
docker-compose up --build
```

### 4. Acesse a aplicação
Abra seu navegador em: **http://localhost:3000**

### 5. Para parar a aplicação
Pressione `Ctrl+C` no terminal, ou em outro terminal:
```bash
docker-compose down
```

## Opção 2: Usando Docker diretamente

### 1. Build da imagem
```bash
docker build -t smartrent-estimator .
```

### 2. Execute o container
```bash
docker run -p 3000:3000 -v $(pwd)/scripts:/app/scripts:ro smartrent-estimator
```

### 3. Acesse a aplicação
Abra seu navegador em: **http://localhost:3000**

## Opção 3: Desenvolvimento Local (Sem Docker)

Se preferir executar sem Docker:

### 1. Instale as dependências
```bash
bun install
# ou
npm install
```

### 2. Execute em modo desenvolvimento
```bash
bun dev
# ou
npm run dev
```

### 3. Acesse a aplicação
Abra seu navegador em: **http://localhost:3000**

## 📝 Notas Importantes

### Modelo de Machine Learning
- O modelo Python (`modelo_3_regressao_linear.pkl`) deve estar no diretório `scripts/`
- O container Docker tem acesso read-only ao diretório de scripts
- Se o modelo não for encontrado, a aplicação usará um modelo de fallback

### Dependências Python
Se você precisar executar o script Python diretamente (fora do Next.js):

```bash
# Instalar dependências Python
pip install pandas scikit-learn

# Executar o script
python scripts/ml_model.py
```

### Variáveis de Ambiente
Se você tiver variáveis de ambiente, crie um arquivo `.env.local`:

```env
# Exemplo
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🔧 Troubleshooting

### Porta 3000 já está em uso
```bash
# Mude a porta no docker-compose.yml
ports:
  - "3001:3000"  # Usa porta 3001 no host
```

### Erro de permissão no Docker
```bash
# Execute com sudo (Linux/Mac)
sudo docker-compose up --build
```

### Rebuild completo
```bash
# Limpar cache e rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## 🚀 Deploy em Produção

Para deploy em produção, recomendamos usar a Vercel:

1. Faça push do código para GitHub
2. Conecte o repositório na Vercel
3. A Vercel fará o deploy automaticamente

Ou use o botão "Publish" na interface do v0!
