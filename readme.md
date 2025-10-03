## Estrutura do projeto
```plaintext
smartrent-estimator/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (landing page)
│   ├── estimator/
│   │   └── page.tsx (formulário e resultados)
│   ├── api/
│   │   └── predict/
│   │       └── route.ts (API backend)
│   └── globals.css
├── components/
│   ├── property-form.tsx
│   ├── property-results.tsx
│   ├── optimization-suggestions.tsx
│   ├── market-analysis-chart.tsx
│   └── ui/ (componentes shadcn)
└── scripts/
    └── ml_model.py (modelo ML)
```

