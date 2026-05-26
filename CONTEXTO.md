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

## Hospedagem e distribuição
- **Web (PWA):** Vercel — https://grb-trocas-copa-2026.vercel.app/ (deploy automático a cada push no master)
- **Android (APK):** gerado via Capacitor + Android Studio (ver `COMO_GERAR_APK.md`)
- **Repositório GitHub:** `grbocz/grb-trocas-copa-2026`

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

Ponto de entrada. Contém:
- Header com título
- Card de progresso (% da coleção completa)
- Grid 3 colunas: Já tenho / Faltam / Repetidas (atalhos para filtros)
- Botão **Minha Coleção**
- Botão **Ver Trocas**
- Botão **Restaurar backup** (importa `.txt` ou `.json`, pede confirmação)
- Ícone decorativo (SVG) ao fundo

---

## Tela Minha Coleção

### Estrutura
- Header: título + botão Exportar + botão Ver Trocas
- Duas colunas lado a lado:
  - **Esquerda (~130px):** toggle Grupos/A-Z, grid 2 colunas de seleções com separadores de grupo
  - **Direita:** subtítulo com range (BRA-1 até BRA-20), legenda de cores, grid 3×20 cards com +/−

### Botão Exportar
- Gera arquivo `.txt` com JSON da coleção
- `navigator.canShare({ files: [file] })` com `type: 'text/plain'`
- Fallback: download direto

---

## Telas de Filtro (Já tenho / Faltam / Repetidas)

### Header
- Botão voltar
- Botão compartilhar (SVG) — só em Faltam e Repetidas; gera texto agrupado por país (ex: `BRA: 3, 7, 15`) sem quantidades
- Título centralizado
- **Repetidas:** subtítulo `X cód. · Y para trocar` (Y = soma dos extras, qtd − 1)
- Toggle **Grupos | A–Z**
- Toggle **Leitura | Edição**

### Modo Leitura
- Grid 5 colunas, cards compactos
- Repetidas: mostra `+N` extras em vez do contador absoluto

### Modo Edição
- Grid 3 colunas com botões +/−
- Rascunho com marcação laranja; footer Descartar / Confirmar

---

## Tela de Trocas

1. Botão para importar `.txt` ou `.json` do amigo
2. Exibe dois blocos:
   - **Ele tem → você precisa:** `contador_dele > 1 && contador_seu = 0`
   - **Você tem → ele precisa:** `contador_seu > 1 && contador_dele = 0`
3. Botão "Copiar lista" em cada bloco

---

## Ícones e PWA

- `public/icon-trocas-copa2026.svg` — ícone original (viewBox ajustado para sem margem)
- `public/icon-192.png` e `public/icon-512.png` — gerados do SVG
- `public/manifest.json` — PWA com `background_color` e `theme_color` `#1B5E20`
- `index.html` — links para manifest, favicon e apple-touch-icon

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
Figurinhas com contador 0 são omitidas. Ausente = 0.

---

## Persistência (localStorage)
```json
{ "nome": "Gustavo", "colecao": { "BRA-1": 2, "BRA-2": 1 } }
```

---

## Regras de negócio
- Contador mínimo = 0
- Figurinha ausente no JSON importado = 0
- Lista de trocas ordenada alfabética/numericamente
- "Nenhuma troca possível" se nenhum lado tem repetidas

---

## Observações técnicas
- Mobile-first, viewport ~360px
- Web Share API: `canShare({ files })` com `type: 'text/plain'`
- `src/data/album.ts` exporta `TODAS_FIGURINHAS`, `colecaoParaCompacto`, `compactoParaColecao`
- `.claude/` no `.gitignore`
- Sem variáveis de ambiente

## Caminhos Windows
- Projeto: `C:\Users\GRBoc\Desktop\grb-trocas-copa-2026`
- Terminal: CMD ou PowerShell

---

## Fora do escopo
- Importar múltiplos arquivos simultaneamente
- Histórico de trocas realizadas
- Sistema de reputação ou avaliação
- Qualquer backend ou autenticação
