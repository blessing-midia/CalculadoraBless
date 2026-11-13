# Calculadora de Preços

Site público com a calculadora individual de preços do Hub Blessing
(`/hub/calculadora-de-precos`): Shopee, Mercado Livre, TikTok Shop e Amazon.

Não tem login, banco nem servidor — é um site estático (React + Vite + Tailwind 4).

## Rodar localmente

```bash
npm install
npm run dev
```

## Deploy na Vercel

1. Suba este repositório para o GitHub.
2. Na Vercel: **Add New → Project**, importe o repositório.
3. A Vercel detecta Vite sozinha (`vercel.json` já define build `npm run build` e saída `dist`).
   Nenhuma variável de ambiente é necessária.
4. Em **Settings → Domains**, adicione o domínio próprio.

## Mesmas regras do Hub

As regras de cálculo e os componentes visuais são **cópias idênticas** dos
arquivos do Hub, na mesma estrutura de pastas:

| Aqui                                              | No Hub (mesmo caminho)                 |
| ------------------------------------------------- | -------------------------------------- |
| `src/features/pricing-calculator/domain/`         | taxas, faixas, categorias e cálculos   |
| `src/features/pricing-calculator/components/`     | cards, campos e gráfico                |
| `src/features/pricing-calculator/styles/`         | CSS da calculadora                     |
| `src/features/catalog/domain/`                    | dois utilitários puros usados pelo domínio |
| `src/index.css`                                   | tokens de tema (sem os imports de outras telas) |

Só três arquivos são próprios deste site:

- `pages/PriceCalculatorPage.tsx` — a mesma tela, sem breadcrumb do Hub e sem salvar/histórico.
- `controllers/useCalculatorWorkspace.ts` — o mesmo cálculo, sem Supabase.
- `src/components/ProductThumb.tsx` — vazio; no Hub só aparece com produto salvo.

**Quando uma taxa ou regra mudar no Hub**, copie de novo a pasta `domain/`
(e `components/`/`styles/` se o visual mudou) do Hub para cá e faça o deploy.
