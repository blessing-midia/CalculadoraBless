/**
 * No Hub, a miniatura do produto só aparece quando a calculadora está dentro de
 * um projeto (produto salvo). O site público não persiste nada, então o
 * `ProductCard` nunca chega a renderizar este componente. Ele existe só para o
 * `ProductCard` continuar idêntico ao do Hub.
 */
export default function ProductThumb(_props: { productId: number; stored?: string | null; size?: 'sm' | 'md' | 'lg' }) {
  void _props;
  return null;
}
