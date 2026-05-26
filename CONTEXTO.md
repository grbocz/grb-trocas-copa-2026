# CONTEXTO DO PROJETO — Trocas Copa 2026

## Visão geral
App web responsivo (mobile-first) para facilitar trocas de figurinhas do álbum da Copa do Mundo 2026 (Panini). Sem backend, sem autenticação, sem servidor. Tudo roda localmente no browser do usuário.

## Problema que resolve
Dois colecionadores precisam descobrir quais figurinhas podem trocar entre si. Cada um marca suas quantidades no app, exporta um arquivo `.txt`, e ao importar o arquivo do outro o app calcula automaticamente as trocas possíveis nos dois sentidos.

## Fluxo principal
1. Usuário abre o app e registra quantas unidades tem de cada figurinha (contador por figurinha)
2. Exporta um arquivo `colecao_[nome]_[data].txt` via share nativo do celular (Web Share API com `canShare` + `text/plain`; fallback para download)
3. Arquivo chega via WhatsApp nos Documentos do WhatsApp do destinatário
4. Destinatário importa o arquivo no próprio app (aceita `.json` e `.txt`)
5. O app cruza os dados e exibe a lista de trocas possíveis:
   - O que o outro tem repetido (contador > 1) que você não tem (contador = 0)
   - O que você tem repetido (contador > 1) que o outro não tem (contador = 0)

## Stack
- React + Vite + TypeScript
- Tailwind CSS
- Capacitor (build Android)
- localStorage (persistência local da coleção do usuário)
- Sem backend, sem autenticação, sem Supabase

## Hospedagem
- Vercel — https://grb-trocas-copa-2026.vercel.app/
- Repositório GitHub: `grbocz/grb-trocas-copa-2026`
- Deploy automático a cada push no master

---

## Dados do álbum — 48 seleções / 12 grupos / 20 figurinhas por seleção

Cada seleção tem exatamente 20 figurinhas, identificadas como `COD-1` até `COD-20`.
Total: 48 seleções × 20 = 960 figurinhas.
Também há figurinhas especiais (FWC e CC) implementadas.

### Grupos e seleções (ordem oficial)

| Grupo | Cód | País |
|-------|-----|------|
| A | MEX | México |
| A | RSA | África do Sul |
| A | KOR | Coreia do Sul |
| A | CZE | República Tcheca |
| B | CAN | Canadá |
| B | BIH | Bósnia |
| B | QAT | Catar |
| B | SUI | Suíça |
| C | BRA | Brasil |
| C | MAR | Marrocos |
| C | HAI | Haiti |
| C | SCO | Escócia |
| D | USA | Estados Unidos |
| D | PAR | Paraguai |
| D | AUS | Austrália |
| D | TUR | Turquia |
| E | GER | Alemanha |
| E | CUW | Curaçao |
| E | CIV | Costa do Marfim |
| E | ECU | Equador |
| F | NED | Holanda |
| F | JPN | Japão |
| F | SWE | Suécia |
| F | TUN | Tunísia |
| G | BEL | Bélgica |
| G | EGY | Egito |
| G | IRN | Irã |
| G | NZL | Nova Zelândia |
| H | ESP | Espanha |
| H | CPV | Cabo Verde |
| H | KSA | Arábia Saudita |
| H | URU | Uruguai |
| I | FRA | França |
| I | SEN | Senegal |
| I | IRQ | Iraque |
| I | NOR | Noruega |
| J | ARG | Argentina |
| J | ALG | Argélia |
| J | AUT | Áustria |
| J | JOR | Jordânia |
| K | POR | Portugal |
| K | COD | RD Congo |
| K | UZB | Uzbequistão |
| K | COL | Colômbia |
| L | ENG | Inglaterra |
| L | CRO | Croácia |
| L | GHA | Gana |
| L | PAN | Panamá |

---

## Tela Home

Ponto de entrada. Botões para:
- **Minha Coleção** — ir para a tela de marcação
- **Ver Trocas** — ir para a tela de trocas
- **Restaurar backup** — importar `.txt` ou `.json` exportado anteriormente para sobrescrever a coleção local (com confirmação)
- Atalhos para as telas de filtro: **Já tenho**, **Faltam**, **Repetidas**

---

## Tela Minha Coleção

### Estrutura geral
- Header fixo: título "Minha coleção" + "Copa 2026" + botão Exportar + botão Ver Trocas
- Corpo: duas colunas lado a lado
- Footer: botão Exportar e botão Ver Trocas

### Coluna esquerda (~130px)
- Toggle no topo: **Grupos** | **A–Z**
- Grid de 2 colunas com cards de seleção
- Separadores "Grupo A", "Grupo B" etc. na ordenação por grupos
- Card ativo com borda/fundo azul
- Scroll vertical independente

### Coluna direita
- Subtítulo: "BRA-1 até BRA-20"
- Legenda: 0 = falta (vermelho) | 1 = tenho (verde) | 2+ = repetida (azul)
- Grid de 3 colunas, 20 cards por seleção
- Cada card: código, contador, botões − e +
- Cores do card refletem o status

### Botão Exportar
- Gera arquivo `.txt` com JSON da coleção
- Usa `navigator.canShare({ files: [file] })` com `type: 'text/plain'`
- Fallback: download direto

---

## Telas de Filtro (Já tenho / Faltam / Repetidas)

Acessadas pela Home. Cada tela exibe apenas as figurinhas do status correspondente.

### Header
- Botão voltar
- Botão compartilhar (ícone SVG) — só em Faltam e Repetidas; gera texto agrupado por país (ex: `BRA: 3, 7, 15`) e abre share nativo
- Título centralizado
- Em **Repetidas**: subtítulo mostra `X cód. · Y para trocar` onde Y é a soma dos extras (qtd − 1)
- Toggle **Grupos | A–Z**
- Toggle **Leitura | Edição**

### Modo Leitura
- Grid 5 colunas, cards compactos
- Em Repetidas: mostra `+N` (extras) em vez do contador absoluto

### Modo Edição
- Grid 3 colunas com botões +/−
- Alterações ficam em rascunho (marcadas em laranja)
- Footer com botões Descartar / Confirmar

---

## Tela de Trocas

### Fluxo
1. Botão para importar arquivo `.txt` ou `.json` do amigo
2. Após importação, exibe dois blocos:
   - **Ele tem → você precisa**: contador_dele > 1 E contador_seu = 0
   - **Você tem → ele precisa**: contador_seu > 1 E contador_dele = 0
3. Cada bloco lista os códigos ordenados + contagem
4. Botão "Copiar lista" em cada bloco

---

## Estrutura do arquivo exportado (`.txt`)
```json
{
  "nome": "Gustavo",
  "versao": "1",
  "exportadoEm": "25/05/2026 18:00:00",
  "colecao": {
    "BRA-1": 2,
    "BRA-2": 1,
    "ARG-5": 3
  }
}
```
Figurinhas com contador 0 são omitidas. Ausente no JSON = 0.

---

## Persistência (localStorage)
```json
{
  "nome": "Gustavo",
  "colecao": { "BRA-1": 2, "BRA-2": 1 }
}
```

---

## Regras de negócio
- Contador mínimo = 0 (botão − não vai abaixo de zero)
- Figurinha ausente no JSON importado = contador 0
- Lista de trocas ordenada alfabética/numericamente por código
- "Nenhuma troca possível" se nenhum dos lados tem repetidas

---

## Observações técnicas
- Mobile-first, viewport ~360px
- Web Share API: usar `canShare({ files })` com `type: 'text/plain'` para abrir share nativo
- `.claude/` no `.gitignore`
- Sem variáveis de ambiente
- `src/data/album.ts` exporta `TODAS_FIGURINHAS`, `colecaoParaCompacto`, `compactoParaColecao` (utilitários de codificação compacta, disponíveis para uso futuro)

## Caminhos Windows
- Desktop home: `C:\Users\GRBoc\Desktop`
- Terminal: CMD ou PowerShell

---

## Fora do escopo
- Importar múltiplos arquivos simultaneamente
- Histórico de trocas realizadas
- Sistema de reputação ou avaliação
- Qualquer backend ou autenticação
