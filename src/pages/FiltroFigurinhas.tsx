import { useMemo } from 'react';
import { SELECOES, GRUPOS, ESPECIAIS, FIGURINHAS_POR_SELECAO } from '../data/album';
import FigurinhaCard from '../components/FigurinhaCard';

export type FiltroTipo = 'tenho' | 'faltam' | 'repetidas';

interface Props {
  filtro: FiltroTipo;
  colecao: Record<string, number>;
  incrementar: (figurinha: string) => void;
  decrementar: (figurinha: string) => void;
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

function matchFiltro(quantidade: number, filtro: FiltroTipo): boolean {
  if (filtro === 'tenho')     return quantidade >= 1;
  if (filtro === 'faltam')    return quantidade === 0;
  if (filtro === 'repetidas') return quantidade >= 2;
  return false;
}

interface Secao {
  titulo: string;
  codigos: string[];
}

const VAZIOS: Record<FiltroTipo, { icon: string; texto: string }> = {
  tenho:     { icon: '📦', texto: 'Nenhuma figurinha marcada ainda' },
  faltam:    { icon: '✅', texto: 'Coleção completa!' },
  repetidas: { icon: '🎉', texto: 'Nenhuma repetida por enquanto' },
};

export default function FiltroFigurinhas({ filtro, colecao, incrementar, decrementar, onVoltar }: Props) {
  const secoes = useMemo<Secao[]>(() => {
    const resultado: Secao[] = [];

    for (const grupo of GRUPOS) {
      for (const selecao of SELECOES.filter((s) => s.grupo === grupo)) {
        const codigos = Array.from({ length: FIGURINHAS_POR_SELECAO }, (_, i) => {
          const codigo = `${selecao.codigo}-${i + 1}`;
          return matchFiltro(colecao[codigo] ?? 0, filtro) ? codigo : null;
        }).filter(Boolean) as string[];

        if (codigos.length > 0) {
          resultado.push({ titulo: `${selecao.codigo} — ${selecao.nome}`, codigos });
        }
      }
    }

    for (const especial of ESPECIAIS) {
      const codigos = especial.numeros
        .map((n) => `${especial.codigo}-${n}`)
        .filter((c) => matchFiltro(colecao[c] ?? 0, filtro));

      if (codigos.length > 0) {
        resultado.push({ titulo: especial.nome, codigos });
      }
    }

    return resultado;
  }, [filtro, colecao]);

  const total = secoes.reduce((acc, s) => acc + s.codigos.length, 0);
  const vazio = VAZIOS[filtro];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className={`flex-none ${CORES_HEADER[filtro]} text-white px-3 py-2 shadow-md flex items-center gap-3`}>
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

      {/* Lista */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {secoes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">{vazio.icon}</div>
            <p className="text-gray-400 text-sm">{vazio.texto}</p>
          </div>
        ) : (
          secoes.map((secao) => (
            <div key={secao.titulo}>
              <h3 className="text-xs font-bold text-gray-500 mb-2 px-1">{secao.titulo}</h3>
              <div className="grid grid-cols-3 gap-2">
                {secao.codigos.map((codigo) => (
                  <FigurinhaCard
                    key={codigo}
                    codigo={codigo}
                    quantidade={colecao[codigo] ?? 0}
                    onIncrementar={() => incrementar(codigo)}
                    onDecrementar={() => decrementar(codigo)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
