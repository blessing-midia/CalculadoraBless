import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

export function AssessoriaLink({ className, decoration, label = 'Diagnóstico gratuito' }: { className: string; decoration?: ReactNode; label?: string }) {
  return (
    <a
      className={`assessoria-link ${className}`}
      href="https://form.blessingmidia.com/?utm_source=calculadora"
      target="_blank"
      rel="noopener noreferrer"
    >
      {decoration}
      <span>{label}</span>
      <span className="assessoria-link-icon" aria-hidden="true">
        <ArrowUpRight size={18} />
      </span>
    </a>
  );
}
