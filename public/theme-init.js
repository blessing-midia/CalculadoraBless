/**
 * Anti-FOUC: aplica o tema antes do primeiro paint.
 *
 * Precisa rodar antes do React. O `ThemeProvider` só escreve `data-theme`
 * quando monta, e até lá a página já foi pintada com a paleta do `:root` — que
 * é a escura. Sem este arquivo, quem usa o modo claro vê a tela piscar escura a
 * cada recarregamento, durante todo o download e execução do bundle.
 *
 * ## Por que é um arquivo, e não um bloco inline
 *
 * A CSP da aplicação não permite `unsafe-inline`
 * (`server/src/middleware/httpSecurity.ts`). Script inline é bloqueado pelo
 * navegador — foi exatamente o que aconteceu com a primeira versão disto, que
 * nunca executou em produção e só aparecia como erro no console. Servido da
 * própria origem, passa sem afrouxar a política.
 *
 * ## Por que a lógica é duplicada
 *
 * Isto espelha `readStoredTheme` de `src/contexts/themeMode.ts`, inclusive a
 * herança da chave antiga `hb-leads-theme`. É duplicação deliberada: importar
 * módulo aqui significaria esperar o bundle, que é justamente o que este
 * arquivo existe para não fazer. Um teste compara os dois lados para não
 * divergirem — se divergirem, o flash volta em outro formato: o primeiro paint
 * usa um tema e o React troca para outro logo depois.
 */
(function () {
  try {
    var stored = localStorage.getItem('hb-theme');
    if (stored === null) stored = localStorage.getItem('hb-leads-theme');
    document.documentElement.setAttribute('data-theme', stored === 'dark' ? 'dark' : 'light');
  } catch (error) {
    // `localStorage` lança em modo privado ou com cookies bloqueados. Sem o
    // `try`, o erro derrubaria o script e a página abriria sem `data-theme`.
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
