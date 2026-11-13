import type { BreakdownRow } from './types';

export const getSegmentColor = (row: BreakdownRow, index: number, total: number): string => {
  const isProfit = index === total - 1;
  if (isProfit) {
    return row.value >= 0 ? '#30D158' : '#FF453A';
  }

  const palette = [
    '#FF6A00',
    '#FF8C33',
    '#FFB266',
    '#FFD699',
    '#48484A',
    '#6E6E73',
    '#8E8E93',
  ];

  return palette[index % palette.length];
};
