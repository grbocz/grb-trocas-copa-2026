import { useMemo } from 'react';
import { SELECOES, GRUPOS, ESPECIAIS, FIGURINHAS_POR_SELECAO } from '../data/album';

export type FiltroTipo = 'tenho' | 'faltam' | 'repetidas';

interface Props {
  filtro: FiltroTipo;
  colecao: Record<string, number>;
  onVoltar: () => void;
}

const TITULOS: Record<FiltroTipo, string> = {
  tenho: 'Já tenho',
  faltam: 'Faltam',
  repetidas: 'Repetidas',
};

const CORES: Record<FiltroTipo, { header: string; chip: string; count: string }> = {
  tenho:     { header: 'bg-green-600',  chip: 'bg-green-100 border-green-500 text-green-800',  count: 'text-green-600' },
  faltam:    { header: 'bg-red-600',    chip: 'bg-red-100 border-red-500 text-red-800',        count: 'text-red-500'   },
  repetidas: { header: 'bg-blue-600',   chip: 'bg-blue-100 border-blue-500 text-blue-800',     count: 'text-blue-600'  },
};

function matchFiltro(quantidade: number, filtro: FiltroTipo): boolean {
  if (filtro === 'tenho')     return quantidade >= 1;
  if (filtro === 'faltam')    return quantidade === 0;
  if (filtro === 'repetidas') return quantidade >= 2;
  return false;
}

interface Secao {
  titulo: string;
  itens: { codigo: string; quantidade: number }[];
}

export default function FiltroFigurinhas({ filtro, colecao, onVoltar }: Props) {
  const secoes = useMemo<Secao[]>(() => {
    const resultado: Secao[] = [];

    for (const grupo of GRUPOS) {
      const selecoes = SELECOES.filter((s) => s.grupo === grupo);
      for (const selecao of selecoes) {
        const itens = Array.from({ length: FIGURINHAS_POR_SELECAO }, (_, i) => {
          const codigo = `${selecao.codigo}-${i + 1}`;
          const quantidade = colecao[codigo] ?? 0;
          return { codigo, quantidade };
        }).filter((item) => matchFiltro(item.quantidade, filtro));

        if (itens.length > 0) {
          resultado.push({ titulo: `${selecao.codigo} — ${selecao.nome}`, itens });
        }
      }
    }

    for (const especial of ESPECIAIS) {
      const itens = especial.numeros.map((n) => {
        const codigo = `${especial.codigo}-${n}`;
        const quantidade = colecao[codigo] ?? 0;
        return { codigo, quantidade };
      }).filter((item) => matchFiltro(item.quantidade, filtro));

      if (itens.length > 0) {
        resultado.push({ titulo: especial.nome, itens });
      }
    }

    return resultado;
  }, [filtro, colecao]);

  const total = secoes.reduce((acc, s) => acc + s.itens.length, 0);
  const cores = CORES[filtro];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className={`flex-none ${cores.header} text-white px-3 py-2 shadow-md flex items-center gap-3`}>
        <button
          onClick={onVoltar}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/10 text-lg font-bold transition-colors"
        >
          ←
        </button>
        <div className="leading-tight">
          <div className="text-xs font-bold tracking-wide">{TITULOS[filtro].toUpperCase()}</div>
          <div className="text-[10px] opacity-75">{total} figurinha{total !== 1 ? 's' : ''}</div>
        </div>
      </header>

      {/* Lista agrupada */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {secoes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">
              {filtro === 'tenho' ? '📦' : filtro === 'faltam' ? '✅' : '🎉'}
            </div>
            <p className="text-gray-400 text-sm">
              {filtro === 'tenho'
                ? 'Nenhuma figurinha marcada ainda'
                : filtro === 'faltam'
                  ? 'Coleção completa!'
                  : 'Nenhuma repetida por enquanto'}
            </p>
          </div>
        ) : (
          secoes.map((secao) => (
            <div key={secao.titulo} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-600 mb-2">{secao.titulo}</h3>
              <div className="flex flex-wrap gap-1.5">
                {secao.itens.map((item) => (
                  <span
                    key={item.codigo}
                    className={`inline-flex items-center gap-1 border rounded px-1.5 py-0.5 text-[11px] font-medium ${cores.chip}`}
                  >
                    {item.codigo}
                    {filtro === 'repetidas' && (
                      <span className={`text-[9px] font-bold ${cores.count}`}>×{item.quantidade}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
