export const ML_PUBLIC_RATE_LIMITS = {
  classic: { min: 0.1, max: 0.14 },
  premium: { min: 0.15, max: 0.19 },
};

export interface MLCategory {
  label: string;
  fallbackClassicRate: number;
  fallbackPremiumRate: number;
}

export const MERCADO_LIVRE_CATEGORIES: Record<string, MLCategory> = {
  moda_roupas: { label: 'Moda e Roupas', fallbackClassicRate: 0.14, fallbackPremiumRate: 0.19 },
  calcados: { label: 'Calçados', fallbackClassicRate: 0.14, fallbackPremiumRate: 0.19 },
  beleza_cuidados: { label: 'Beleza e Cuidados Pessoais', fallbackClassicRate: 0.13, fallbackPremiumRate: 0.18 },
  casa_decoracao: { label: 'Casa, Móveis e Decoração', fallbackClassicRate: 0.13, fallbackPremiumRate: 0.18 },
  eletrodomesticos: { label: 'Eletrodomésticos', fallbackClassicRate: 0.12, fallbackPremiumRate: 0.17 },
  eletronicos_audio_video: { label: 'Eletrônicos, Áudio e Vídeo', fallbackClassicRate: 0.11, fallbackPremiumRate: 0.16 },
  celulares_telefonia: { label: 'Celulares e Telefonia', fallbackClassicRate: 0.11, fallbackPremiumRate: 0.16 },
  informatica: { label: 'Informática', fallbackClassicRate: 0.11, fallbackPremiumRate: 0.16 },
  games: { label: 'Games', fallbackClassicRate: 0.12, fallbackPremiumRate: 0.17 },
  autopecas: { label: 'Acessórios para Veículos / Autopeças', fallbackClassicRate: 0.12, fallbackPremiumRate: 0.17 },
  ferramentas: { label: 'Ferramentas', fallbackClassicRate: 0.12, fallbackPremiumRate: 0.17 },
  esporte_fitness: { label: 'Esporte e Fitness', fallbackClassicRate: 0.12, fallbackPremiumRate: 0.17 },
  brinquedos_hobbies: { label: 'Brinquedos e Hobbies', fallbackClassicRate: 0.12, fallbackPremiumRate: 0.17 },
  papelaria: { label: 'Papelaria', fallbackClassicRate: 0.12, fallbackPremiumRate: 0.17 },
  petshop: { label: 'Pet Shop', fallbackClassicRate: 0.12, fallbackPremiumRate: 0.17 },
  supermercado: { label: 'Supermercado', fallbackClassicRate: 0.11, fallbackPremiumRate: 0.16 },
  livros_revistas: { label: 'Livros e Revistas', fallbackClassicRate: 0.1, fallbackPremiumRate: 0.15 },
  joias_relogios: { label: 'Joias e Relógios', fallbackClassicRate: 0.13, fallbackPremiumRate: 0.18 },
  bebes: { label: 'Bebês', fallbackClassicRate: 0.12, fallbackPremiumRate: 0.17 },
  industria_comercio: { label: 'Indústria e Comércio', fallbackClassicRate: 0.12, fallbackPremiumRate: 0.17 },
  musica_instrumentos: { label: 'Música e Instrumentos', fallbackClassicRate: 0.12, fallbackPremiumRate: 0.17 },
  saude: { label: 'Saúde', fallbackClassicRate: 0.12, fallbackPremiumRate: 0.17 },
  outros: { label: 'Outras Categorias', fallbackClassicRate: 0.13, fallbackPremiumRate: 0.18 },
};

export const MERCADO_LIVRE_SELLER_RATE_OVERRIDES: Record<
  string,
  { classicRate: number; premiumRate: number }
> = {};

export const getMercadoLivreCategoryConfig = (categoryKey: string): MLCategory =>
  MERCADO_LIVRE_CATEGORIES[categoryKey] || MERCADO_LIVRE_CATEGORIES.outros;

export const getMercadoLivreCommissionRate = ({
  categoryKey,
  listingType,
  customRate = null,
}: {
  categoryKey: string;
  listingType: 'classic' | 'premium';
  customRate?: number | null;
}): number => {
  if (customRate !== null && Number.isFinite(customRate) && customRate > 0) {
    return customRate;
  }

  const category = MERCADO_LIVRE_CATEGORIES[categoryKey] || MERCADO_LIVRE_CATEGORIES.outros;
  const override = MERCADO_LIVRE_SELLER_RATE_OVERRIDES[categoryKey];

  if (listingType === 'premium') {
    return override?.premiumRate ?? category.fallbackPremiumRate;
  }

  return override?.classicRate ?? category.fallbackClassicRate;
};
