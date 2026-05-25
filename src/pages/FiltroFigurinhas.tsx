import { useMemo, useState } from 'react';
import { SELECOES, GRUPOS, ESPECIAIS, FIGURINHAS_POR_SELECAO } from '../data/album';

export type FiltroTipo = 'tenho' | 'faltam' | 'repetidas';

interface Props {
  filtro: FiltroTipo;
  colecao: Record<string, number>;
  aplicarLote: (lote: Record<string, number>) => void;
  onVoltar: () => void;
}

const TITULOS: Record<FiltroTipo, string> = {
  tenho: 'Já tenho',
  faltam: 'Faltam',
  repetidas: 'Repetidas',
};

const CORES_HEADER: Record<FiltroTipo, string> = {
  tenho:     'bg-green-600',
  faltam:    'bg-red-600',
  repetidas: 'bg-blue-600',
};

const VAZIOS: Record<FiltroTipo, { icon: string; texto: string }> = {
  tenho:     { icon: '📦', texto: 'Nenhuma figurinha marcada ainda' },
  faltam:    { icon: '✅', texto: 'Coleção completa!' },
  repetidas: { icon: '🎉', texto: 'Nenhuma repetida por enquanto' },
};

function matchFiltro(quantidade: number, filtro: FiltroTipo): boolean {
  if (filtro === 'tenho')     return quantidade >= 1;
  if (filtro === 'faltam')    return quantidade === 0;
  if (filtro === 'repetidas') return quantidade >= 2;
  return false;
}

function corCard(qtd: number) {
  if (qtd === 0) return 'bg-red-200 border-red-600';
  if (qtd === 1) return 'bg-green-200 border-green-600';
  return 'bg-blue-200 border-blue-600';
}

function corContador(qtd: number) {
  if (qtd === 0) return 'text-red-700';
  if (qtd === 1) return 'text-green-700';
  return 'text-blue-700';
}

interface Secao {
  titulo: string;
  codigos: string[];
}

export default function FiltroFigurinhas({ filtro, colecao, aplicarLote, onVoltar }: Props) {
  const [rascunho, setRascunho] = useState<Record<string, number>>({});
  const [modoEdicao, setModoEdicao] = useState(false);

  function getValor(codigo: string): number {
    return codigo in rascunho ? rascunho[codigo] : (colecao[codigo] ?? 0);
  }

  function handleIncrementar(codigo: string) {
    setRascunho((prev) => ({ ...prev, [codigo]: getValor(codigo) + 1 }));
  }

  function handleDecrementar(codigo: string) {
    const atual = getValor(codigo);
    if (atual <= 0) return;
    setRascunho((prev) => ({ ...prev, [codigo]: atual - 1 }));
  }

  function confirmar() {
    aplicarLote(rascunho);
    setRascunho({});
  }

  function descartar() {
    setRascunho({});
  }

  function gerarTexto(): string {
    const header = filtro === 'faltam'
      ? `Faltam (Copa 2026) — ${totalCards} figurinha${totalCards !== 1 ? 's' : ''}:`
      : `Repetidas (Copa 2026) — ${totalCards} figurinha${totalCards !== 1 ? 's' : ''}:`;

    const linhas = secoes.map((secao) => {
      const cod = secao.titulo.split(' ')[0];
      const items = secao.codigos.map((codigo) => {
        const num = codigo.split('-')[1];
        if (filtro === 'repetidas') {
          const qtd = colecao[codigo] ?? 0;
          return `${num} (+${qtd - 1})`;
        }
        return num;
      });
      return `${cod}: ${items.join(', ')}`;
    });

    return `${header}\n${linhas.join('\n')}`;
  }

  function compartilhar() {
    const texto = gerarTexto();
    if (navigator.share) {
      navigator.share({ text: texto, title: TITULOS[filtro] + ' — Copa 2026' })
        .catch(() => navigator.clipboard?.writeText(texto));
    } else {
      navigator.clipboard?.writeText(texto);
    }
  }

  function toggleModo() {
    // Ao sair do modo edição com pendentes, descarta automaticamente
    if (modoEdicao && Object.keys(rascunho).length > 0) {
      descartar();
    }
    setModoEdicao((v) => !v);
  }

  const secoes = useMemo<Secao[]>(() => {
    const resultado: Secao[] = [];
    for (const grupo of GRUPOS) {
      for (const selecao of SELECOES.filter((s) => s.grupo === grupo)) {
        const codigos = Array.from({ length: FIGURINHAS_POR_SELECAO }, (_, i) =>
          `${selecao.codigo}-${i + 1}`
        ).filter((c) => matchFiltro(colecao[c] ?? 0, filtro));
        if (codigos.length > 0) resultado.push({ titulo: `${selecao.codigo} — ${selecao.nome}`, codigos });
      }
    }
    for (const especial of ESPECIAIS) {
      const codigos = especial.numeros
        .map((n) => `${especial.codigo}-${n}`)
        .filter((c) => matchFiltro(colecao[c] ?? 0, filtro));
      if (codigos.length > 0) resultado.push({ titulo: especial.nome, codigos });
    }
    return resultado;
  }, [filtro, colecao]);

  const totalCards = secoes.reduce((acc, s) => acc + s.codigos.length, 0);
  const totalAlteracoes = Object.keys(rascunho).length;
  const temAlteracoes = modoEdicao && totalAlteracoes > 0;
  const vazio = VAZIOS[filtro];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className={`flex-none ${CORES_HEADER[filtro]} text-white px-3 py-2 shadow-md`}>
        <div className="flex items-center gap-2">
          <button
            onClick={onVoltar}
            className="w-8 h-8 flex-none flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/10 text-lg font-bold transition-colors"
          >
            ←
          </button>

          {/* Botão compartilhar — só para faltam e repetidas */}
          {(filtro === 'faltam' || filtro === 'repetidas') && secoes.length > 0 && (
            <button
              onClick={compartilhar}
              className="flex-none w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/10 transition-colors"
              title="Compartilhar lista"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
            </button>
          )}

          <div className="leading-tight flex-1 min-w-0 text-center">
            <div className="text-xs font-bold tracking-wide">{TITULOS[filtro].toUpperCase()}</div>
            <div className="text-[10px] opacity-75">{totalCards} figurinha{totalCards !== 1 ? 's' : ''}</div>
          </div>

          {/* Switch Leitura / Edição */}
          <div className="flex-none flex items-center gap-1.5">
            <span className={`text-[10px] font-medium transition-opacity ${modoEdicao ? 'opacity-50' : 'opacity-100'}`}>
              Leitura
            </span>
            <button
              onClick={toggleModo}
              className={`relative w-10 h-5 rounded-full transition-colors ${modoEdicao ? 'bg-orange-400' : 'bg-white/30'}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${modoEdicao ? 'left-5' : 'left-0.5'}`}
              />
            </button>
            <span className={`text-[10px] font-medium transition-opacity ${modoEdicao ? 'opacity-100' : 'opacity-50'}`}>
              Edição
            </span>
          </div>

          {temAlteracoes && (
            <div className="flex-none bg-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {totalAlteracoes}
            </div>
          )}
        </div>
      </header>

      {/* Lista */}
      <div className={`flex-1 overflow-y-auto p-3 space-y-4 ${temAlteracoes ? 'pb-24' : ''}`}>
        {secoes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">{vazio.icon}</div>
            <p className="text-gray-400 text-sm">{vazio.texto}</p>
          </div>
        ) : (
          secoes.map((secao) => (
            <div key={secao.titulo}>
              <h3 className="text-xs font-bold text-gray-500 mb-2 px-1">{secao.titulo}</h3>

              {modoEdicao ? (
                /* Modo edição — 3 colunas com botões +/− */
                <div className="grid grid-cols-3 gap-2">
                  {secao.codigos.map((codigo) => {
                    const qtd = getValor(codigo);
                    const modificado = codigo in rascunho;
                    return (
                      <div key={codigo} className="relative">
                        {modificado && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-400 rounded-full z-10 border border-white" />
                        )}
                        <div className={`border-2 rounded-lg flex flex-col items-center justify-between py-1.5 px-0.5 ${corCard(qtd)} ${modificado ? 'ring-2 ring-orange-400' : ''}`}>
                          <span className="text-[13px] text-gray-600 font-semibold leading-none">{codigo}</span>
                          <span className={`text-base font-bold leading-none my-1 ${corContador(qtd)}`}>{qtd}</span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleDecrementar(codigo)}
                              disabled={qtd === 0}
                              className="w-7 h-7 rounded-full bg-white border border-gray-300 text-gray-700 text-sm font-bold flex items-center justify-center active:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm leading-none"
                            >
                              −
                            </button>
                            <button
                              onClick={() => handleIncrementar(codigo)}
                              className="w-7 h-7 rounded-full bg-white border border-gray-300 text-gray-700 text-sm font-bold flex items-center justify-center active:bg-gray-100 shadow-sm leading-none"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Modo leitura — 5 colunas, cards compactos sem botões */
                <div className="grid grid-cols-5 gap-1.5">
                  {secao.codigos.map((codigo) => {
                    const qtd = colecao[codigo] ?? 0;
                    const label = filtro === 'repetidas' ? `+${qtd - 1}` : String(qtd);
                    return (
                      <div
                        key={codigo}
                        className={`border-2 rounded-lg flex flex-col items-center justify-center py-1.5 px-0.5 ${corCard(qtd)}`}
                      >
                        <span className="text-[11px] text-gray-600 font-semibold leading-none text-center">{codigo}</span>
                        <span className={`text-xs font-bold leading-none mt-0.5 ${corContador(qtd)}`}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer de confirmação */}
      {temAlteracoes && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 shadow-lg">
          <button
            onClick={descartar}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-3 text-sm font-semibold active:opacity-80 transition-colors"
          >
            Descartar
          </button>
          <button
            onClick={confirmar}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-3 text-sm font-semibold active:opacity-80 transition-colors"
          >
            Confirmar {totalAlteracoes} alteraç{totalAlteracoes !== 1 ? 'ões' : 'ão'}
          </button>
        </div>
      )}
    </div>
  );
}
