# Diagnóstico de design da calculadora

*Blessing: reforce confiança, clareza e identidade*

## Resumo executivo

**A Blessing precisa harmonizar uma identidade já reconhecível e tornar a decisão de preço mais confiável, antes de acrescentar efeitos ou redesenhar tudo.** A leitura pela Unslop recomenda refinamento dirigido: preservar laranja/preto/branco, Montserrat, Cris, transição para o ícone, carrossel colorido/cinza e navegação mobile por etapas com barra inferior estilo Instagram. Os achados mais importantes são a diferença entre margem solicitada e exibida no Mercado Livre, a composição com denominadores distintos e o desaparecimento do CTA durante a exploração mobile. Na interface, a orientação repetida ocupa espaço antes dos campos, enquanto o desktop dá precedência à composição sobre o resultado. Há acertos concretos: proposta específica, atualização ao editar, preservação de dados entre etapas, navegação direta e tratamento de movimento reduzido. Recomenda-se priorizar significado dos números, acesso à tarefa e legibilidade; depois consolidar componentes e encurtar a coreografia de marca. Impactos apresentados são expectativas de projeto, sem métricas de conversão ou desempenho inventadas. ([Evidências de experiência](../research_notes/Diagnóstico%20de%20design%20da%20calculadora/experiencia.md))

## A Unslop orienta refinamento contextual, não uma troca de marca

### Fonte escolhida e método

A referência adotada é **heydamir/unslop**, de **Damir Sokolovsky**, arquivo `skills/unslop/SKILL.md`, fixado no commit `620163eedb3529d9cd23a3994ed8d287d06f760d`. Esta síntese adapta criticamente seus critérios, com atribuição sob **CC BY 4.0**. O homônimo [0design/unslop-skill](https://github.com/0design/unslop-skill) também trata de design, mas tem outro processo; não foram executados seu detector ou canon. A escolha corresponde ao método de direção visual e nove passes solicitado, sem alegar exclusividade ou prioridade histórica. ([Unslop no commit consultado](https://github.com/heydamir/unslop/blob/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md); [autoria e licença declaradas](https://github.com/heydamir/unslop))

Foram lidas as três notas e examinadas quatro capturas locais. A nota de experiência registra observação funcional de `/` e `/calculadora` em 25/11/2026, a 390×844, 1440×900 e 320×568. A nota de sistema visual é **análise estática**, incluindo contraste; não comprova renderização de todos os seletores. Esta síntese não abriu navegador nem executou a skill como implementação. ([Método e testes registrados](../research_notes/Diagnóstico%20de%20design%20da%20calculadora/experiencia.md); [análise estática](../research_notes/Diagnóstico%20de%20design%20da%20calculadora/sistema-visual.md))

### Os nove passes explicam as prioridades

A ordem **espaçamento → cor → ícones → texto → tipografia → layout → detalhes → visuais → movimento** evita polir o efeito antes de esclarecer a informação. Espaçamento e layout expõem a orientação mobile redundante e os quadrantes desktop pouco proporcionais ao conteúdo. Cor e tipografia apontam contraste insuficiente em ações e labels pequenos. Ícones pedem coerência e nomes visíveis nos ajustes, sem substituir as marcas dos canais. Texto e detalhes exigem unidades consistentes, margem-meta distinguível da efetiva e recuperação de erro. Visuais e movimento sustentam manter a assinatura da Blessing, concentrando expressão onde ela não atrase a tarefa. A Unslop é uma lente de qualidade, não prova de autoria por IA nem validação financeira. ([Processo e critérios](https://github.com/heydamir/unslop/blob/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md); [sinais de revisão](https://github.com/heydamir/unslop/blob/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/references/signs.md))

## A home comunica valor, mas perde continuidade na exploração

A promessa “Informe o custo e a margem” explica a tarefa, o CTA laranja é identificável e a demonstração oferece contexto. No desktop, texto à esquerda e produto à direita criam uma composição legível. No mobile, porém, a inspeção registrou que “Veja como funciona” leva à demonstração com as ações ocultas; o rodapé não repete a entrada. Voltar ao topo restaura o botão, portanto **não é perda irreversível**, mas um retorno desnecessário. Acrescentar um CTA compacto após a demonstração mantém acesso direto sem impor uma barra adicional permanente. ([Ações da home](../src/landing/LandingPage.tsx#L101); [ocultação no scroll](../src/landing/useLandingMotion.ts#L82))

O carrossel colorido/cinza deve permanecer, com menor concorrência entre animações. Seus campos, chips e pontos parecem controles, mas a demonstração não oferece seleção ou pausa expostas. Rotular “Exemplo com valores ilustrativos”, permitir escolher os passos e pausar o ciclo torna a aparência previsível. O estado cinza pode indicar contexto inativo sem apagar informações necessárias à comparação. A Unslop favorece visuais que demonstram algo verdadeiro: “Outros” precisa usar **R$**, como na ferramenta, e o carrinho deve evitar sugerir suporte a Magalu, AliExpress e SHEIN quando a cobertura informada é Shopee, Mercado Livre, TikTok Shop e Amazon. ([Demonstração](../src/landing/LandingPage.tsx#L128); [unidade real](../src/features/pricing-calculator/components/workspace/ProductCard.tsx#L86))

O diagnóstico comercial conserva utilidade, mas merece hierarquia secundária antes do cálculo e maior relevância contextual após o resultado. A recomendação é reduzir competição visual, não extinguir a oferta. As capturas documentam o [hero mobile, 390×844](../.playwright-mcp/ux-home-mobile-390.png) e a [home desktop, 1440×900](../.playwright-mcp/ux-home-desktop-1440.png). Na segunda, os zeros pertencem a um instante da contagem animada, não demonstram falha permanente.

## A calculadora deve colocar significado e comparação antes da decoração

### Confiança nos números precede acabamento

**A discrepância no Mercado Livre exige revisão específica da regra e da apresentação.** Com custo R$ 40,00, embalagem R$ 1,50, meta de 30%, extras/fretes zero e ajustes padrão, a observação registrou preço R$ 72,81, lucro R$ 15,09 e margem de 20,7%, sem alerta de meta não atingida. Os outros canais exibiram 30%. Isso confirma divergência entre entrada e saída, mas não determina definitivamente um bug matemático: taxas, faixas, convergência e significado da meta precisam ser verificados. Até esclarecer a regra, a interface deve distinguir “Margem desejada” de “Margem efetiva” e informar desvios relevantes. ([Reprodução E5](../research_notes/Diagnóstico%20de%20design%20da%20calculadora/experiencia.md); [cálculo ML](../src/features/pricing-calculator/domain/calculators/mercado-livre-calculator.ts#L102))

Na composição padrão Shopee, o produto de R$ 25,00 ocupa aproximadamente 58,8% dos custos, mas a coluna mostra 43,5% da venda. As duas contas usam bases diferentes; a mesma cor aproxima significados distintos. Escolher “% dos custos” para anel e legenda, ou representar o preço incluindo lucro, exige decisão de produto. Se ambas as leituras forem necessárias, separá-las explicitamente. Esse é o passe de detalhes da Unslop aplicado a dado como conteúdo, sem criar gráficos decorativos. ([Base do anel](../src/features/pricing-calculator/controllers/useCostChartAnimation.ts#L10); [percentual da coluna](../src/features/pricing-calculator/components/workspace/CostCompositionCard.tsx#L106))

### Mobile precisa de menos repetição; desktop, de precedência do resultado

As etapas e a navegação inferior permitem controlar a complexidade e saltar diretamente ao destino; os valores permanecem preservados. O atrito está no cabeçalho, canais, instrução, progresso e títulos repetidos. Em 320×568, a inspeção encontrou apenas cerca de 47 px do card Produto entre seu início e o menu no primeiro viewport. Manter canais expandidos no início e resumi-los depois, com edição acessível, recupera espaço. Nos resultados, uma comparação compacta dos quatro canais deve anteceder detalhes expansíveis, preservando o preço grande. ([Estrutura mobile](../src/features/pricing-calculator/pages/PriceCalculatorPage.tsx#L79))

No desktop observado, Produto/Composição ficam acima de Ajustes/Resultados, com vazio no primeiro card e legenda densa no segundo. Propõe-se testar entradas à esquerda e resumo de resultados no alto à direita, deixando composição subordinada, sem excluir conteúdo. A ordem de leitura e foco deve acompanhar a nova hierarquia. A nota estática também identifica regras de altura que comprimem controles: é risco a verificar em janelas baixas e zoom, não corte visual comprovado. ([Ordem atual](../src/features/pricing-calculator/pages/PriceCalculatorPage.tsx#L113); [regras de densidade](../src/features/pricing-calculator/styles/spacing.css#L211))

As evidências visuais são a [calculadora mobile, página inteira](../.playwright-mcp/ux-calculadora-produto-mobile-390.png) e a [calculadora desktop estabilizada](../.playwright-mcp/ux-calculadora-desktop-1440.png). A barra fixa na captura longa corresponde à posição do viewport; não prova conteúdo permanentemente inacessível.

### Estados devem orientar correção sem bloquear exploração

Funcionam a atualização ao editar, seleção vazia com instrução, destaque de custo na legenda, resultados negativos e estados inviáveis. Preservar esses comportamentos. Para margem inviável, oferecer explicação próxima ao campo e retorno ao ajuste responsável; para resultado negativo, escrever “Prejuízo por unidade”, sem depender só da cor. Validar formato e colagem: a análise estática indica que `12.50` pode virar `1250` e `-10` virar `10`; isso ainda requer teste de entrada. Foco, seleção e erro devem ser distinguíveis, unidades precisam integrar as instruções acessíveis e atualizações relevantes devem ser anunciadas sem falar a cada tecla. ([Resultados](../src/features/pricing-calculator/components/workspace/ResultsCard.tsx#L69); [parser analisado](../src/features/pricing-calculator/domain/formatters.ts#L31))

## Uma direção precisa, direta e confiável preserva a personalidade

### Proposta visual e parâmetros iniciais

Adaptando as cinco linhas da Unslop: **produto/público**, ferramenta para quem prepara preços em marketplaces, com perfil predominante ainda a confirmar; **caráter**, precisa, direta e confiável; **material**, linhas de orçamento, unidades e totais; **riqueza visual**, carrossel da home e passagem Cris→ícone; **assinatura**, total legível com acento laranja. Superfícies brancas/neutras e estrutura preta sustentam a identidade, deixando laranja para ação e seleção. A composição pode manter cores categóricas quando houver legenda consistente; não se deve aplicar mecanicamente “um acento” a dados distintos. ([Direção e preservação de marca](https://github.com/heydamir/unslop/blob/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/SKILL.md))

Como **proposta para a Blessing, não obrigação da skill**, manter Montserrat; testar corpo/input 16/24 px, labels essenciais 13–14/20, títulos de seção 18–20/28 e preço principal 28–32/36, com números tabulares e valores comparativos alinhados à direita. Usar pesos 400/500 e 600 seletivamente. Partir de espaços 4/8/12/16/24/32 px: 4–8 entre label e campo, 16 entre campos, 24 entre grupos e margens mobile de 16–20. Controles touch de 44–48 px e linhas de legenda de 40–44 favorecem conforto. Consolidar tokens de superfície, texto, acento, estado, foco e raio, aproveitando a escala pública existente. ([Tokens orientativos da Unslop](https://github.com/heydamir/unslop/blob/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/references/tokens.md); [escala local](../src/features/pricing-calculator/styles/spacing.css#L1))

### Acessibilidade e movimento exigem correções específicas

O par **branco sobre #ff4c0c tem 3,34:1**, abaixo de **4,5:1 para texto normal**. A análise calculou 5,04:1 com texto #1d1d1f sobre esse laranja: é uma alternativa a testar, preservando a marca. Título grande tem outro enquadramento; o achado não reprova todo laranja nem toda a página. Há foco observado no campo de custo e bom suporte a movimento reduzido, mas o select apresenta risco estático de supressão do indicador. Radios/abas precisam completar seus contratos de teclado, e resultados precisam associar métricas e valores em HTML, sem depender de pseudo-elementos. Isso não equivale a auditoria WCAG global. ([Cálculos e distinções](../research_notes/Diagnóstico%20de%20design%20da%20calculadora/sistema-visual.md); [WCAG contraste](https://www.w3.org/TR/WCAG22/#contrast-minimum); [APG radio](https://www.w3.org/WAI/ARIA/apg/patterns/radio/); [APG abas](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/))

A passagem Cris→ícone permanece como assinatura. Recomenda-se preservar explicitamente a preferência do usuário de exibi-la em todo acesso a `/calculadora`, inclusive acesso direto, reload e retorno, encurtando a duração e encadeando os efeitos, com preparação da ferramenta em paralelo e status até concluir, sem mudar essa política de exibição. A soma nominal das timelines é **3,7–3,9 s até montagem**, seguida da entrada dos cards: estimativa do código, não medição em produção nem INP. Recomenda-se também fazer a navegação de etapas responder antes de terminar o efeito, preservando acesso direto às etapas. A demonstração automática precisa de pausa; a preferência de movimento reduzido deve continuar respeitada. ([Transição](../src/components/CalculatorLoading.tsx#L75); [roteamento](../src/App.tsx#L39); [WCAG pausa](https://www.w3.org/TR/WCAG22/#pause-stop-hide); [definição e medição de INP](https://web.dev/articles/optimize-inp))

## Onze ações organizam uma evolução verificável

Gravidade descreve risco observado ou potencial; impacto é qualitativo e esforço é estimativa relativa. **O** indica observação registrada, **S** análise estática; nenhuma estimativa substitui teste.

| Ação priorizada | Gravidade / evidência | Impacto esperado | Esforço | Como verificar |
|---|---|---|---|---|
| 1. Revisar regra ML e explicitar meta versus efetiva | Alta · O, E5 | Confiança financeira | Alto | Reproduzir cenário 30%/20,7%, conferir faixas e documentar regra/alerta |
| 2. Unificar base do anel e legenda | Alta · O, E6 | Compreensão dos custos | Médio | Conferir denominadores e pedir explicação da composição |
| 3. Manter CTA após demonstração | Alta · O, E1 | Continuidade da entrada | Baixo | Alcançar calculadora após explorar em 320 e 390 px |
| 4. Corrigir contraste das ações | Alta · S, A1 | Leitura dos controles | Baixo | Recalcular pares de texto normal em repouso, hover e animação |
| 5. Corrigir foco, teclado e relações dos resultados | Alta · S, A2–A4 | Operação e leitura assistida | Médio | Percorrer com teclado/leitor de tela, conferindo métrica, valor e unidade |
| 6. Validar entrada e tornar erros acionáveis | Alta · O, E11; S, A4 | Recuperação e integridade da entrada | Médio | Testar vazio, colagem, ponto/vírgula, prejuízo e meta inviável |
| 7. Compactar orientação mobile e comparação | Média · O, E7 | Acesso aos campos/resultados | Médio | Comparar canais e editar sem perder dados, incluindo teclado virtual |
| 8. Priorizar resultados no desktop | Média · O, E8; S, V2 | Hierarquia decisória | Médio | Encontrar preço/lucro e verificar janela baixa/zoom |
| 9. Harmonizar demo, unidades e canais | Média · O, E2–E3 | Expectativa correta | Médio | Conferir cobertura, R$, seleção de passos e pausa do carrossel |
| 10. Encurtar/encadear Cris→ícone, preparando a ferramenta em paralelo e preservando exibição em todo acesso; agilizar feedback de etapas | Média · O, E9; S, P1–P3 | Rapidez percebida | Médio | Medir acesso→campo utilizável e testar acesso direto, reload, retorno e reduced-motion |
| 11. Consolidar tokens, labels, alvos e oferta secundária | Média · O, E4/E10/E12; S, V1 | Coerência e legibilidade | Médio | Revisar temas, nomes de canais e toque na legenda sem apagar comparativos |

E, A, V e P identificam achados nas notas de [experiência](../research_notes/Diagnóstico%20de%20design%20da%20calculadora/experiencia.md) e [sistema visual](../research_notes/Diagnóstico%20de%20design%20da%20calculadora/sistema-visual.md).

### Roteiro em três etapas e critérios de sucesso

**Etapa 1 — confiança e acesso:** tratar ações 1–6, separando investigação da regra ML de correção textual. Concluir quando entrada, meta, resultado e composição tiverem significado consistente; erros oferecerem recuperação; CTA, foco e contrastes dos controles forem verificáveis.

**Etapa 2 — hierarquia responsiva:** executar ações 7–9 e a parte tipográfica da 11. Comparar protótipos em mobile real e desktop. Sucesso significa encontrar preço e lucro sem ajuda, comparar canais, explicar o gráfico e voltar a ajustes preservando dados. Medir sucesso, erros de interpretação e tempo de tarefa, estabelecendo referência antes de prometer ganhos.

**Etapa 3 — assinatura e consolidação:** executar ação 10 e completar tokens/estados. Conferir pausa, movimento reduzido, foco após rota, zoom e alvos; medir animações em aparelho modesto antes de otimizar canvas. A meta é a identidade acompanhar o uso com prontidão e informação estáveis, sem percentuais de melhoria presumidos.

### Limites e hipóteses abertas

Não há testes com usuários, analytics, leitor de tela completo, auditoria WCAG integral ou medições de produção. A observação mobile usa emulação; safe area, teclado físico/virtual e baixa visão continuam pendentes. Tema escuro e compressões de CSS são riscos estáticos a confirmar. Não foram auditadas vigência das tarifas nem causa definitiva da divergência ML. Precisam de teste o entendimento do carrossel, a descoberta da legenda, a utilidade do resumo compacto, o momento da oferta comercial e a percepção da duração de Cris. Também permanecem abertas a base preferida da composição, a política pública de temas e a caracterização do usuário predominante.

### Conclusão

A identidade da Blessing oferece uma vantagem: já existe material próprio para uma interface distinta. O próximo salto depende de transformar essa identidade em linguagem operacional consistente. Uma calculadora confiável permite entender o que cada número significa e agir sobre ele; a expressão visual ganha força quando sustenta essa compreensão.
