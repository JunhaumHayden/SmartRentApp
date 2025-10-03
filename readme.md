<h1 align="center"> 🧠🏡 SmartRent Estimator <br> <span style="font-size:1.5rem;">🚀 Frontend App</span> </h1>

<p align="center">
  <img src="http://img.shields.io/static/v1?label=STATUS&message=Em%20Desenvolvimento&color=brightgreen&style=for-the-badge"/>
</p>

<p align="center">
  <em>✨ Precificar aluguel com <strong>UI elegante</strong>, <strong>machine learning</strong> e um toque de <strong>nerdice</strong> 🔮</em>
</p>

---

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-13%2B-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3%2B-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Shadcn/UI](https://img.shields.io/badge/Shadcn/UI-Clean%20Components-purple)](https://ui.shadcn.com/)
[![Python Backend](https://img.shields.io/badge/API-SmartRent%20Estimator%20API-blue?logo=fastapi)](https://github.com/JunhaumHayden/SmartRent-API)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/license/mit/)
[![Made with Love](https://img.shields.io/badge/Made%20with-💖-red)]()

[![GitHub Repo stars](https://img.shields.io/github/stars/JunhaumHayden/SmartRent?style=social)](https://github.com/JunhaumHayden/SmartRent)
[![GitHub forks](https://img.shields.io/github/forks/JunhaumHayden/SmartRent?style=social)](https://github.com/JunhaumHayden/SmartRent/fork)
[![GitHub watchers](https://img.shields.io/github/watchers/JunhaumHayden/SmartRent?style=social)](https://github.com/JunhaumHayden/SmartRent/watchers)

</div>

---

## 🏗️ Sobre o Projeto

O **SmartRent Estimator APP** é a interface futurista 🧑‍🚀 para explorar o poder do nosso modelo de Machine Learning.  

Imagine um corretor digital que:
- recebe dados 📋  
- conversa com a API ⚡  
- e entrega análises e preços 🧮 em uma UI leve, responsiva e bonita ✨

> Porque ciência de dados boa também precisa de **boas interfaces** 🧠🎨

---

## ✨ Features

- 🧠 **Formulário interativo** para entrada de dados do imóvel  
- 📊 Visualização clara de **preço estimado** + **sugestões de valorização**  
- 🌐 Totalmente integrado com a [SmartRent API](https://github.com/JunhaumHayden/SmartRent-API)  
- 🧭 Navegação intuitiva com Next.js App Router  
- 🌐 Navegação rápida e responsiva, com design clean e moderno
- 🧰 Componentes reutilizáveis com Shadcn/UI + TailwindCSS

---

## ⚡ Como Rodar o Projeto
📦 Instalação
```bash
npm install
# ou
yarn install

```
🚀 Desenvolvimento Local
```bash
npm run dev
# ou
yarn dev
```

Depois acesse 👉 http://localhost:3000

### Docker
Consulte o [guia](DOCKER_SETUP.md). 


## 🧭 Estrutura do Projeto

```plaintext
smartrent-estimator/
├── app/
│   ├── layout.tsx               # Layout global do app
│   ├── page.tsx                 # Landing page ✨
│   ├── estimator/
│   │   └── page.tsx             # Formulário + Resultados 🧮
│   ├── api/
│   │   └── predict/
│   │       └── route.ts         # Proxy de requisição p/ backend
│   └── globals.css              # Estilos globais
├── components/
│   ├── property-form.tsx        # Form principal de entrada
│   ├── property-results.tsx     # Exibição dos resultados 💸
│   ├── optimization-suggestions.tsx # Sugestões de valorização
│   ├── market-analysis-chart.tsx    # Gráficos de mercado 📊
│   └── ui/                      # Componentes Shadcn/UI reutilizáveis
└── scripts/
    └── ml_model.py              # Modelo ML local para dev
```
---

##  Licença

MIT — ou seja: use, quebre, refaça, mas me cite se for ficar famoso com isso 😎

---

🧙‍♂️ Autores
<table> <tr> <td align="center"> <a href="https://github.com/JunhaumHayden"> <img src="https://avatars.githubusercontent.com/u/183040803?v=4" width="115"/><br> <sub><b>Lucas Marisco</b></sub> </a> </td> <td align="center"> <a href="https://github.com/JunhaumHayden"> <img src="https://avatars.githubusercontent.com/u/79289647?v=4" width="115"/><br> <sub><b>Carlos Hayden</b></sub> </a> </td> </tr> </table>
<p align="center"> <em>🧠💻 Built with data, code & caffeine.<br> May the <strong>rent</strong> be ever in your favor.</em> ☕✨ </p>


