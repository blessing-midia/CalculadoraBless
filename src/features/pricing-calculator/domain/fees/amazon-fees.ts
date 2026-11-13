import { AMAZON_CATEGORIES } from '../config/amazon-categories';
import type { AmazonCategoryRule, AmazonPlan } from '../types';

export const getAmazonItemFee = (plan: AmazonPlan): number => (plan === 'ind' ? 2 : 0);

export const getAmazonCategoryRule = (category: string): AmazonCategoryRule =>
  AMAZON_CATEGORIES[category] ?? AMAZON_CATEGORIES.demais;

export const getAmazonCommissionRate = (category: string): number =>
  getAmazonCategoryRule(category).rate;

export const getAmazonCommission = ({
  totalSaleAmount,
  category,
}: {
  totalSaleAmount: number;
  category: string;
}): number => {
  const rule = getAmazonCategoryRule(category);
  if (totalSaleAmount <= 0) return 0;
  const percentageCommission = totalSaleAmount * rule.rate;
  return Math.max(percentageCommission, rule.minCommission);
};
