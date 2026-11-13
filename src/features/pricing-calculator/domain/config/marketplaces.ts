import type { MarketplaceKey } from '../types';

export const MARKETPLACES: Record<
  MarketplaceKey,
  { name: string; route: string; color: string; logo: string; description: string }
> = {
  shopee: {
    name: 'Shopee',
    route: '/shopee',
    color: '#FF3300',
    logo: '/logos/shopee.svg',
    description: 'Comissão escalonada por faixa de preço',
  },
  mercadoLivre: {
    name: 'Mercado Livre',
    route: '/mercado-livre',
    color: '#FFE600',
    logo: '/logos/mercado-livre.svg',
    description: 'Clássico ou Premium com custo fixo',
  },
  tiktok: {
    name: 'TikTok Shop',
    route: '/tiktok',
    color: '#FF0050',
    logo: '/logos/tiktok.webp',
    description: 'Menor taxa base: 6% com teto de R$50',
  },
  amazon: {
    name: 'Amazon',
    route: '/amazon',
    color: '#FF9900',
    logo: '/logos/amazon.svg',
    description: 'Comissão por categoria com plano Individual ou Profissional',
  },
};

export const MARKETPLACE_LIST: MarketplaceKey[] = ['shopee', 'mercadoLivre', 'tiktok', 'amazon'];
