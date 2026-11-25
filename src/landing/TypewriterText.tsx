/** Reserve the complete text layout while GSAP reveals letters, keeping it accessible. */
export function TypewriterText({ text }: { text: string }) {
  const words = text.split(' ');
  return <>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true">{words.map((word, index) => (
      <span key={index}>
        <span className="lp-typed-word">{Array.from(word).map((letter, i) => <span key={i} data-lp-char>{letter}</span>)}</span>
        {index < words.length - 1 ? ' ' : ''}
      </span>
    ))}</span>
  </>;
}
