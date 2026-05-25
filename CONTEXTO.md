# CONTEXTO DO PROJETO — Trocas Copa 2026

## Visão geral
App web responsivo (mobile-first) para facilitar trocas de figurinhas do álbum da Copa do Mundo 2026 (Panini). Sem backend, sem autenticação, sem servidor. Tudo roda localmente no browser do usuário.

## Problema que resolve
Dois colecionadores precisam descobrir quais figurinhas podem trocar entre si. Cada um marca suas quantidades no app, exporta um arquivo JSON, e ao importar o arquivo do outro o app calcula automaticamente as trocas possíveis nos dois sentidos.

## Fluxo principal
1. Usuário abre o app e registra quantas unidades tem de cada figurinha (contador por figurinha)
2. Exporta um arquivo `colecao_[nome].json` via share nativo do celular (Web Share API, fallback para download)
3. Outro usuário importa esse arquivo no próprio app
4. O app cruza os dados e exibe a lista de trocas possíveis:
   - O que o outro tem repetido (contador > 1) que você não tem (contador = 0)
   - O que você tem repetido (contador > 1) que o outro não tem (contador = 0)

## Stack
- React + Vite + TypeScript
- Tailwind CSS
- shadcn/ui
- localStorage (persistência local da coleção do usuário)
- Sem Supabase, sem autenticação, sem backend

## Hospedagem
- Azure Static Web Apps
- Repositório GitHub: `GustavoBocuzzi/trocas-copa-2026`
- CI/CD via GitHub Actions

---

## Dados do álbum — 48 seleções / 12 grupos / 20 figurinhas por seleção

Cada seleção tem exatamente 20 figurinhas, identificadas como `COD-1` até `COD-20`.
Total: 48 seleções × 20 = 960 figurinhas (mais eventuais figurinhas especiais — ignorar no MVP).

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

## Layout — Tela principal (Minha Coleção)

### Estrutura geral
- Header fixo: título "Minha coleção" + "Copa 2026"
- Corpo: duas colunas lado a lado (altura total da tela)
- Footer fixo: botões Exportar e Ver trocas

### Coluna esquerda (largura fixa ~130px)
- Toggle no topo: **Grupos** | **A–Z**
- Grid de 2 colunas com cards de seleção
- Cada card: sigla em destaque (ex: BRA) + nome abreviado embaixo em fonte menor (1 linha, truncar se necessário)
- Quando ordenado por grupos: separador de texto "Grupo A", "Grupo B" etc. ocupando largura total, antes de cada bloco de 4 países
- Card da seleção ativa destacado com borda azul e fundo azul claro
- Scroll vertical independente

### Coluna direita (largura restante)
- Subtítulo: "BRA-1 até BRA-20" (atualiza conforme seleção ativa)
- Legenda compacta: 0 = falta (vermelho) | 1 = tenho (verde) | 2+ = repetida (azul)
- Grid de 3 colunas com 20 cards de figurinha
- Cada card de figurinha contém:
  - Identificador: `COD-N` (ex: BRA-1) em fonte pequena
  - Número contador grande e centralizado
  - Dois botões circulares: **−** e **+**
  - Cor do card muda conforme contador:
    - **0** → fundo vermelho claro, borda vermelha (falta)
    - **1** → fundo verde claro, borda verde (tenho)
    - **2+** → fundo azul claro, borda azul (repetida)
- Sem scroll (os 20 cards cabem na tela)

---

## Tela de Trocas

Acessada pelo botão "Ver trocas" no footer.

### Fluxo
1. Botão para importar arquivo `.json` de outro usuário
2. Após importação, exibe dois blocos:
   - **Ele tem, você precisa**: figurinhas onde contador_dele > 1 E contador_seu = 0
   - **Você tem, ele precisa**: figurinhas onde contador_seu > 1 E contador_dele = 0
3. Cada bloco lista as figurinhas (ex: BRA-3, ARG-7, ESP-12...) ordenadas
4. Botão "Copiar lista" para colar no WhatsApp

---

## Estrutura do arquivo JSON exportado
```json
{
  "nome": "Gustavo",
  "versao": "1",
  "colecao": {
    "BRA-1": 2,
    "BRA-2": 1,
    "BRA-3": 0,
    "ARG-5": 3
  }
}
```
Apenas figurinhas com contador > 0 precisam ser salvas (omitir as zeradas economiza espaço; ao importar, ausente = 0).

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
- Se nenhum dos lados tem repetidas, exibir mensagem amigável "Nenhuma troca possível por enquanto"

---

## Observações técnicas
- App deve funcionar bem em celular (mobile-first, viewport ~360px)
- Web Share API para compartilhamento nativo; fallback para download de arquivo se não suportado
- `.claude/` deve estar no `.gitignore`
- Não usar variáveis de ambiente (sem backend)
- Commits sem testes locais são aceitáveis

## Caminhos Windows
- Desktop home: `C:\Users\GRBoc\Desktop`
- Terminal: PowerShell ou CMD

---

## Fora do escopo (MVP)
- Importar múltiplos arquivos simultaneamente
- Histórico de trocas realizadas
- Sistema de reputação ou avaliação
- Qualquer backend ou autenticação
- Figurinhas especiais / brilhantes
