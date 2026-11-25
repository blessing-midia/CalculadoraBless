# Unslop — fontes e critérios para avaliação da calculadora Blessing

## 1. Qual é a fonte original pertinente e como distinguir os homônimos?

### Takeaway

A fonte principal escolhida para a avaliação é **[heydamir/unslop](https://github.com/heydamir/unslop)**, de **Damir Sokolovsky**, porque o próprio projeto se apresenta como skill de transformação de interfaces com aparência genérica de IA e contém um processo completo de direção visual e nove passes de refinamento. Há outro projeto de design legítimo, **[0design/unslop-skill](https://github.com/0design/unslop-skill)**, voltado a auditoria com catálogo remoto; portanto, o nome isolado não permite afirmar que existe uma única Unslop de design.

### Cited Findings

- **Repositório da fonte principal:** https://github.com/heydamir/unslop. O README atribui a criação a Damir Sokolovsky, vincula seu perfil `@heydamir` e descreve suporte a Claude Code, Codex e Google Antigravity, para apps, dashboards e landing pages. — [README original consultado](https://github.com/heydamir/unslop)
- **Caminho exato da skill:** `skills/unslop/SKILL.md`. **Pasta da skill:** `skills/unslop/`. O frontmatter declara `name: unslop`, autor Damir Sokolovsky e licença CC-BY-4.0. — [SKILL.md integral, fixado em commit](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)
- **Commit recuperado:** `620163eedb3529d9cd23a3994ed8d287d06f760d`, autor/committer registrado como `Damir`, data `2026-11-15T00:55:18Z`. Mensagem: `story-path tests resolve the temp folder first so they pass on macOS, where it is a symlink; drop the Quran example`. A árvore retornada para HEAD e os textos principais foram consultados nesse SHA. — [Commit original via API GitHub](https://api.github.com/repos/heydamir/unslop/commits/620163eedb3529d9cd23a3994ed8d287d06f760d); [árvore original](https://api.github.com/repos/heydamir/unslop/git/trees/620163eedb3529d9cd23a3994ed8d287d06f760d?recursive=1)
- **Versão:** o `SKILL.md` e o manifesto do plugin consultados não declaram versão semântica. O identificador reprodutível usado nestas notas é o commit, não um número inventado de release. `cff-version: 1.2.0` em `CITATION.cff` é versão do formato de citação, não versão da skill. O arquivo de citação também identifica Damir Sokolovsky e o próprio repositório como `repository-code`. — [manifesto no SHA, API consultada com resposta raw](https://api.github.com/repos/heydamir/unslop/contents/.claude-plugin/plugin.json?ref=620163eedb3529d9cd23a3994ed8d287d06f760d); [CITATION.cff no SHA, API consultada com resposta raw](https://api.github.com/repos/heydamir/unslop/contents/CITATION.cff?ref=620163eedb3529d9cd23a3994ed8d287d06f760d)
- **Licença e atribuição:** README, frontmatter e rodapés das referências declaram CC BY 4.0 e pedem preservação do crédito a Damir Sokolovsky e link para o repositório nas cópias/adaptações. Estas notas são uma síntese/adaptação crítica dos critérios, com esse crédito preservado. — [README/licença declarada](https://github.com/heydamir/unslop); [SKILL.md](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)

#### Homônimos conferidos em fontes primárias

| Projeto | O que a fonte efetivamente diz | Decisão para esta pesquisa |
| --- | --- | --- |
| [heydamir/unslop](https://github.com/heydamir/unslop) | Skill que transforma UI com aparência de IA em interface com caráter próprio; audita, define direção e trabalha em passes. | Fonte principal por correspondência direta com melhoria visual de uma calculadora existente. |
| [0design/unslop-skill](https://github.com/0design/unslop-skill) | Plugin/skill de auditoria; audita sem editar código e escreve planos. Usa detector determinístico e um canon remoto versionado. A skill se chama `audit`, em `skills/audit/SKILL.md`. | Também é design, mas é outro projeto/processo. Não atribuir suas regras, detector ou canon a Damir. |
| [theclaymethod/unslop](https://github.com/theclaymethod/unslop) | Skill para detectar e revisar escrita formulaica preservando significado e voz; README apresenta scanners de prosa e comandos teach/cleanup/rewrite/mimic. | Excluído como fundamento de design visual. Não confundir seu `SKILL.md` da raiz com a skill de UI. |

- O `SKILL.md` de `0design/unslop-skill` foi lido integralmente para conferir a distinção: requer reconhecimento de stack e design system; pin de versão/checksum do canon via MCP; verificação adversarial dos achados; planos com `file:line`, valores exatos, convenções, passos e verificação. Sem canon verificado, proíbe emitir aprovação. Sua operação completa requer scripts/MCP e não foi executada nesta pesquisa. — [SKILL.md original do homônimo de auditoria](https://raw.githubusercontent.com/0design/unslop-skill/main/skills/audit/SKILL.md)
- O README desse segundo projeto informa 56 regras públicas, 37 verificações de máquina e canon gerado `public-2026.11.06-1`. Isso descreve o segundo projeto e não a Unslop de nove passes. Os registros completos do canon não foram recuperados nem usados como critérios nestas notas. — [README de 0design](https://github.com/0design/unslop-skill)

### Inferences

- A escolha de `heydamir/unslop` é uma decisão de pertinência: sua descrição e instruções correspondem ao pedido de melhoria de design. Não se baseia apenas em popularidade e não prova que o usuário tinha esse repositório específico em mente. — Base: [README heydamir](https://github.com/heydamir/unslop); [README 0design](https://github.com/0design/unslop-skill)
- É defensável tratá-lo como fonte original **dos critérios de Damir aqui extraídos**, porque autoria, arquivo de citação e repositório coincidem. Não foi demonstrada prioridade histórica sobre todos os projetos chamados Unslop. — Base: [CITATION.cff](https://api.github.com/repos/heydamir/unslop/contents/CITATION.cff?ref=620163eedb3529d9cd23a3994ed8d287d06f760d)

### Gaps

- Não foi determinado qual projeto o usuário conhecia antes de formular o pedido; o nome é ambíguo e há pelo menos dois candidatos de design confirmados.
- A busca de repositórios via `gh search repos unslop` apresentou outros candidatos, como `unslop-anything`, `unslop-ui` e ferramentas de lint. Não houve levantamento exaustivo nem leitura integral desses candidatos; não se afirma exclusividade ou precedência histórica.
- Não foi consultado o histórico completo, tags/releases ou o texto integral de `LICENSE`; a licença foi conferida pelas declarações consistentes no README, skill, manifesto, citação e referências.

## 2. Quais instruções, critérios, anti-padrões e processo estão confirmados?

### Takeaway

A skill deve ser usada como revisão deliberada de craft: observar o que é renderizado, registrar sinais concretos com localização, graduar a intervenção, derivar uma direção do produto e revisar em ordem. Os valores de referência são pontos de partida; o próprio arquivo de tokens manda preservar um sistema existente que já seja bom. — [SKILL.md](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md); [tokens.md](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/references/tokens.md)

### Cited Findings

#### Cobertura de leitura

Leitura textual integral, sem instalação e sem execução das rotinas da skill:

1. [SKILL.md](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md), incluindo frontmatter, processo, nove passes, story video, proibições e checklist.
2. [references/signs.md](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/references/signs.md), inventário de sinais e correções.
3. [references/tokens.md](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/references/tokens.md), escalas e valores iniciais.
4. [references/visuals.md](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/references/visuals.md), decisão sobre necessidade de imagens e orientações de composição.
5. [references/refs.md](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/references/refs.md), descrições e critérios dos exemplos acabados; as imagens em si não foram inspecionadas.
6. [README do projeto principal](https://github.com/heydamir/unslop), além dos metadados citados na seção anterior.

#### Processo de inspeção e decisão

- **Observar antes de julgar:** localizar arquivos que renderizam a tela e, quando possível, avaliar screenshot/render real, não apenas código. Há rotas para site sem código e screenshot isolada, mas elas envolvem snapshots ou reconstrução e não são necessárias nesta pesquisa documental. — [SKILL, Run it 1](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)
- **Inventário verificável:** passar por todos os grupos de `signs.md`; registrar cada sinal em uma linha, com sua localização. Isso sustenta uma revisão por evidência em vez de apenas dizer que algo “parece IA”. — [signs.md](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/references/signs.md)
- **Graduar a intervenção:** muitos sinais em cor, tipo, ícones e texto levam ao processo completo; poucos sinais levam a polish conservando paleta, tipo, layout e visual da marca; nenhum sinal permite dizer “sem slop” e sugerir no máximo dois ou três refinamentos com valores exatos. Não redesenhar uma tela boa apenas para diferenciá-la. — [SKILL, Run it 3](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)
- **Direção em cinco linhas:** produto/público; caráter em duas ou três palavras concretas; mundo/material; um ou dois momentos de riqueza visual; um detalhe de assinatura. Evita adjetivos genéricos como clean, modern, sleek, minimal e premium. Preserva uma marca real existente e deriva as decisões do produto, não de tendências. A execução normal apresenta auditoria e direção antes de editar. — [SKILL, Direction e Run it 4](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)
- **Nove passes nesta ordem:** espaçamento → cor → ícones → texto → tipografia → layout → detalhes → visuais → movimento. Completar cada camada na tela inteira. Texto vem antes de tipo/layout porque o comprimento modifica a composição. Visuais e movimento chegam depois de uma tela que já funcione sem eles. — [SKILL, Run it 5](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)
- **Fechamento:** reaplicar checklist, renderizar e comparar com a lista de achados; relatar direção, mudanças por passe e prompts de imagem, quando existirem. A skill limita a três renderizações de conferência por execução normal para manter rapidez. Story video é opcional e tem processo separado. — [SKILL, Run it 6–8 e Story video](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)

#### Dez critérios confirmados para orientar a avaliação

| Critério | Regra e valores confirmados | Anti-padrões correspondentes | Fonte |
| --- | --- | --- | --- |
| 1. Ritmo e alinhamento | Grade de 4 px; admite ajustes internos de 2 px e exceção de centralização exata. Elementos equivalentes compartilham altura, gap e padding. Distâncias internas menores que as externas; números alinhados à direita. | Margens avulsas de 13 px, linhas desiguais, cards irmãos com paddings diferentes, rótulos fora de coluna. | [SKILL, Spacing](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md) |
| 2. Cor com hierarquia | Uma rampa neutra, três papéis de texto e um acento esparso; apps mantêm superfícies realmente neutras. Cor de marca fica no acento. Texto sobre acento e acento usado como texto devem atingir 4,5:1. | Tudo destacado, superfícies laranjas/azuis inteiras em app, gradientes entre matizes, glows, sombras coloridas, texto em gradiente. | [SKILL, Color](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md) |
| 3. Tipografia e números | Uma família de UI e no máximo uma parceira; pesos 400/500, 600 raro; hierarquia por tamanho e cor. Números tabulares e formato uniforme. | Pesos 800/900, excesso de tamanhos, labels em caixa alta muito espaçada, tracking negativo em texto pequeno, formatações monetárias inconsistentes. | [SKILL, Type](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md) |
| 4. Ícones coerentes e necessários | Um conjunto, 16 ou 18 px, stroke 1,5, cor do papel textual, box uniforme e gap fixo de 8 ou 10 px. Preservar conjunto existente; lucide apenas se não houver. | Emojis decorativos, cada ícone com cor/tamanho próprios, símbolo em todo título sem ajudar a compreensão. | [SKILL, Icons](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md) |
| 5. Linguagem específica e factual | Rótulos curtos; título identifica contexto; variações dizem sua referência; dados plausíveis; alegações só se verificáveis. | Saudações genéricas, hype, exclamações, pontuação final em labels/botões, badges desnecessários, números e promessas inventados. | [SKILL, Copy](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md) |
| 6. Layout responsivo legível | Preservar seções e ordem. No desktop, app tem proporção de app e conteúdo fluido; no pequeno, empilha em ordem de leitura e simplifica previews densos em vez de miniaturizá-los. Preview não desce de 11 px. | Desktop comprimido numa coluna estreita, tudo centralizado por padrão, mobile como screenshot encolhida do desktop. | [SKILL, Layout](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md) |
| 7. Coerência de componentes e estados | Raio interno = externo − padding, piso 4 px; controles 8–10 px, cards 12–16 px. Hover e foco existem, com anel visível; cabeçalho, valor em uso, seleção e foco de tabela são distinguíveis. | Tudo em pílula, badges brilhantes, controles com cantos discrepantes, estado ativo com glow, foco ausente. | [SKILL, Details e Checklist](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md) |
| 8. Dado é conteúdo, não decoração | Card estatístico com rótulo, número e mudança contextualizada. Gráfico tem prioridade e tipo adequado: linha para tendência, barras para comparação, barra empilhada/lista para participação, progresso para meta. | Sparklines e minigráficos em todo card, arco-íris numa só série, gráficos redundantes de mesmo tamanho, preenchimento com dados sem sentido. | [SKILL, Details](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md) |
| 9. Identidade e visual do produto | Um ou dois momentos expressivos cercados de chrome quieto; apps quase nunca precisam de imagens geradas. O visual deve demonstrar algo verdadeiro e a assinatura deve nascer do produto. | Blobs, orbs, robôs e cérebros genéricos, “efeito visual por seção”, copiar composição de referência, trocar apenas o nome e servir para qualquer produto. | [SKILL, Visuals/Direction/Checklist](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md); [visuals.md](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/references/visuals.md) |
| 10. Movimento funcional e contido | Uma curva `cubic-bezier(0.22, 1, 0.36, 1)` como início; feedback 120–180 ms, menus 160–220 ms. Declarar propriedades; priorizar transform/opacity e mudanças de cor. | Pulse/ping sem dado vivo, parallax, hover que expande cards, springs com overshoot, transition-all e animação de width/height/top/left. | [SKILL, Motion](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md); [tokens, Motion](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/references/tokens.md) |

#### Valores úteis, sem os transformar em obrigação universal

- Espaçamentos iniciais: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128`; internos de controle 4–12; entre grupos 12–24; entre seções 32–64; linhas touch 40–44. Cards 20–24 de padding e bordas de página 24–32 no texto principal. — [tokens.md](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/references/tokens.md); [SKILL, Spacing](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)
- Rampa clara graphite: fundo `#fafafa`, card `#ffffff`, superfície elevada `#f4f4f5`, texto primário `#171717`, secundário `#525252`, muted `#737373`. Rampa escura graphite: fundo `#141415`, card `#19191b`, elevada `#232325`, texto primário `#ededed`, secundário `#a1a1a6`, muted `#85858b`. Hairline sugerida: texto primário a 8%. Muted é reservado a meta/captions, não corpo, e deve permanecer perto de 4,5:1 na superfície. — [tokens, Neutral ramps](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/references/tokens.md)
- Tipografia inicial: labels pequenos 12/16; captions 13–14/20; corpo 14–15/20–22; números de card 28–32, peso 500 e tabulares; título de página 28–36. Não importar tamanhos de hero de landing page automaticamente para formulário de cálculo. A primeira parte é transcrição dos tokens; a última é aplicação contextual. — [tokens, Type scale](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/references/tokens.md)
- Os tokens são explicitamente valores iniciais, e não um house style; um bom sistema local deve ser preservado. — [tokens, abertura](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/references/tokens.md)

### Inferences

- Os sinais são uma lente de qualidade visual, não um detector científico de autoria por IA. Um elemento só deve virar achado quando existir e prejudicar o objetivo/contexto; o próprio processo admite tela boa sem alterações. — Base: [SKILL, Run it 3 e Do not](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)
- O valor da ordem dos passes para a calculadora é reduzir retrabalho: resolver agrupamentos antes da paleta e acertar nomes/unidades antes de ajustar dimensões finais dos controles. — Base: [SKILL, Run it 5](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)

### Gaps

- `references/rtl.md` não foi lido: trata especificamente de interfaces RTL, sem pertinência demonstrada ao contexto em português. O SKILL e signs mencionam que suas regras prevalecem quando o idioma exigir RTL.
- `references/effects.md` não foi lido: tratamentos de imagem/glyphs não são necessários para avaliar uma calculadora. Não se propõem esses efeitos.
- As imagens de `references/refs/` não foram abertas; só suas descrições integrais em `refs.md` foram lidas. Não se afirma inspeção visual dos exemplos.
- O documento não estabelece que escalas, famílias tipográficas ou banimentos estéticos sejam universais, nem apresenta resultados empíricos de usabilidade da calculadora.

## 3. Como aplicar à calculadora Blessing mobile/desktop e quais são os limites?

### Takeaway

Para a futura avaliação, preservar a identidade laranja/branco/preto e usar a skill para verificar clareza de entrada, hierarquia do resultado e consistência entre tamanhos de tela. As propostas abaixo são **inferências de aplicação**, não defeitos observados na calculadora e não instruções literais específicas de preços presentes na Unslop. — Base: [SKILL, Color, Type, Layout e Do not](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)

### Cited Findings

- A regra original manda preservar nome, funcionalidades, conteúdo e ordem das seções, salvo pedido expresso, e proíbe inventar dados/alegações/funcionalidades. Isso delimita uma revisão visual da calculadora. — [SKILL, Do not](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)
- Marca existente fornece o acento; superfícies de apps continuam neutras. A regra de contraste permite escurecer o acento ou colocar texto escuro sobre ele, conforme o par medido. — [SKILL, Color](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)
- A skill favorece números tabulares, formatos consistentes, alinhamento e foco visível; a versão mobile deve respeitar ordem de leitura, sem reduzir uma composição densa a uma miniatura. — [SKILL, Spacing, Type, Layout e Details](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)
- A orientação sobre imagens começa por perguntar se a tela precisa de uma; dashboards, configurações e a maioria das telas de app não precisam. — [visuals.md, Decide what the visual is](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/references/visuals.md)

### Inferences

#### Direção preliminar para o pesquisador visual validar

Não é uma direção aprovada nem uma afirmação sobre públicos ainda não pesquisados:

- **Produto:** calculadora de preços Blessing para quem prepara cálculos de preço; confirmar usuário e tarefa predominantes.
- **Caráter:** precisa, direta, confiável.
- **Mundo:** orçamento e composição de preço; linhas, unidades e totais como material visual.
- **Momento:** resultado principal ou decomposição de preço já existente; verificar qual merece destaque, sem criar novo gráfico.
- **Assinatura:** uma forma consistente de apresentar total e unidade com acento laranja, derivada da marca real; validar se já existe um padrão melhor.

Essas cinco linhas adaptam o método, não são exemplos do autor. — Base: [SKILL, Direction](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)

#### Recomendações e perguntas concretas para a inspeção

1. **Laranja como acento:** conferir se ele marca seleção, ação principal ou total, em vez de simultaneamente pintar cabeçalhos, todos os cards, ícones e fundos. Manter branco/preto e neutros para estrutura; não transformar a recomendação em obrigação de mudar o laranja oficial. Medir os pares reais: não presumir que branco sobre laranja passa contraste. — Base: [SKILL, Color](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)
2. **Moeda e percentuais:** conferir `R$`, separadores, casas decimais e unidades de forma consistente dentro de cada papel de dado; usar tabular-nums e alinhamento à direita em comparações monetárias. A skill não prescreve pt-BR, nem exige que reais e percentuais tenham a mesma precisão; a adaptação deve respeitar semântica e regra de negócio. — Base: [SKILL, Type e Spacing](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)
3. **Entradas agrupadas:** conferir se rótulo, unidade, input e ajuda formam uma unidade visual e se a distância para o grupo seguinte é maior. Comparar paddings e alturas de campos equivalentes e espaçamento entre composição de custos e resultado, quando tais seções existirem. — Base: [SKILL, Spacing](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)
4. **Resultado que lidera:** conferir se preço principal é reconhecido rapidamente e se valores auxiliares ficam subordinados. Evitar inventar sparkline ou gráfico apenas para parecer dashboard. Só recomendar representação gráfica se dados e pergunta reais a justificarem. — Base: [SKILL, Details e Visuals](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)
5. **Desktop com espaço útil:** observar se formulário e resumo podem aproveitar largura com alinhamento e proporções adequadas dentro das seções existentes, sem impor sidebar de 240–280 px a uma aplicação que não precise dela. A faixa de sidebar é um token de app, não exigência de criar navegação nova. — Base: [SKILL, Layout e Do not](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md); [tokens, App layout](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/references/tokens.md)
6. **Mobile por leitura, não por redução:** observar ordem dos grupos, largura dos campos e legibilidade do resultado. Usar alturas touch 40–44 px como referência inicial da skill, não como certificado de acessibilidade; se houver tabela funcional, não esconder informação necessária só porque a regra de previews sugere menos colunas. — Base: [SKILL, Layout](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md); [tokens, Spacing scale](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/references/tokens.md)
7. **Texto operacional:** avaliar se campos distinguem conceitos reais como custo, margem, desconto e total somente quando tais conceitos existirem; evitar rótulos vagos ou copy promocional. Não alterar fórmula nem tratar margem e markup como equivalentes por conveniência textual. — Base: [SKILL, Copy e Do not](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)
8. **Estados reconhecíveis:** observar foco de teclado, hover, seleção e mensagens de erro, quando presentes. Laranja de marca não deve substituir indiscriminadamente cores semânticas. Essa verificação aplica os estados e semântica citados pelo autor, mas não equivale a auditoria completa de acessibilidade. — Base: [SKILL, Color, Details e Checklist](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)
9. **Movimento de cálculo:** se valores mudarem animados, verificar se a animação explica a atualização e não cria distração. Não adicionar pulse ou grandes entradas; não presumir que o cálculo precise de botão novo ou animação. — Base: [SKILL, Motion e Do not](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)
10. **Registro de evidências:** para cada hipótese confirmada pelo outro pesquisador, anotar tela/viewport, componente ou região, evidência observada, regra e recomendação. Classificar como intervenção pesada, polish ou sem slop apenas depois da inspeção. Não substituir o relatório por nota global de gosto sem rastreabilidade. — Base: [SKILL, Run it](https://raw.githubusercontent.com/heydamir/unslop/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md)

### Gaps

- **Acesso:** a busca web de código do GitHub exibiu exigência de login e não retornou resultados de código. URL tentada: https://github.com/search?q=unslop+SKILL.md&type=code. A busca de repositórios e as APIs de árvore/metadados via `gh`, bem como GitHub/Raw via webfetch, funcionaram.
- **Escopo:** não foi usado Playwright, não houve inspeção visual da aplicação, execução de scripts da skill, instalação ou alteração do código da calculadora. O único novo artefato desta pesquisa é este arquivo de notas.
- **Contexto local:** consultou-se apenas a pasta de destino para confirmar existência e evitar sobrescrever notas; a estrutura/código da aplicação não foi investigada. A paleta e o contexto mobile/desktop são premissas fornecidas no pedido, não medições independentes.
- **Auditoria ainda pendente:** cores/contrastes reais, breakpoints, componentes, fluxo de cálculo, tamanhos de toque, estados, acessibilidade e hierarquia renderizada dependem da inspeção do outro pesquisador. Nenhuma falha foi atribuída à Blessing sem observação.
- **Limite da metodologia:** Unslop não valida fórmulas de preço, precisão, arredondamento, cobertura de regras de negócio ou usabilidade com usuários. A referência de 11 px se aplica a texto de preview denso, não autoriza corpo/input de 11 px nem demonstra conformidade WCAG.
- **Tensões internas:** o material pede “um elemento brilhante” em uma passagem e “um ou dois momentos” em outras; recomenda neutralidade muito forte para apps, mas rejeita a aplicação mecânica do mesmo visual cinza a qualquer produto; uma passagem admite slots vazios para imagem futura, enquanto o checklist exige resultado sem placeholder. Para esta avaliação, preservar contexto de app, marca existente e informação funcional; não transformar essas preferências em reprovação automática.
- **Canon do homônimo:** não se conectou ao MCP de `0design`, não houve checksum verificado, nem execução de detector. Portanto, não há aprovação nem alegação de auditoria oficial segundo aquele processo. Seu README/SKILL foram usados apenas para desambiguação documental.
- **Reprodutibilidade:** referências da fonte principal estão fixadas no SHA informado; READMEs web e o SKILL do homônimo de auditoria foram consultados em versões correntes e podem mudar. A pesquisa foi realizada em 25/11/2026, conforme a data do ambiente.
