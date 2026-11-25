export function wavePath(progress: number, remaining: boolean) {
  const x = -0.25 + progress * 1.5;
  const bend = Math.sin(progress * Math.PI) * 0.26;
  const edge = `M ${x} 0 C ${x + bend} 0.18 ${x - bend} 0.32 ${x} 0.5 C ${x + bend} 0.68 ${x - bend} 0.82 ${x} 1`;
  return `${edge} L ${remaining ? 1 : 0} 1 L ${remaining ? 1 : 0} 0 Z`;
}
