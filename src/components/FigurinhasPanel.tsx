import { ESPECIAIS } from '../data/album';
import FigurinhaCard from './FigurinhaCard';

interface Props {
  selecaoAtiva: string;
  getQuantidade: (figurinha: string) => number;
  incrementar: (figurinha: string) => void;
  decrementar: (figurinha: string) => void;
}

const NUMEROS_PADRAO = Array.from({ length: 20 }, (_, i) => String(i + 1));

function getNumerosParaSelecao(codigo: string): string[] {
  const especial = ESPECIAIS.find((e) => e.codigo === codigo);
  return especial ? especial.numeros : NUMEROS_PADRAO;
}

export default function FigurinhasPanel({ selecaoAtiva, getQuantidade, incrementar, decrementar }: Props) {
  const numeros = getNumerosParaSelecao(selecaoAtiva);
  const rows = Math.ceil(numeros.length / 3);
  const especial = ESPECIAIS.find((e) => e.codigo === selecaoAtiva);

  const subtitulo = especial
    ? especial.nome
    : `${selecaoAtiva}-1 até ${selecaoAtiva}-20`;

  return (
    <section className="flex-1 flex flex-col min-w-0 bg-gray-50 overflow-hidden px-2">
      {/* Subtítulo e legenda — fixos no topo */}
      <div className="flex-none pt-2 pb-1.5">
        <h2 className="text-xs font-semibold text-gray-700 leading-none">{subtitulo}</h2>
        <div className="flex gap-2.5 mt-1 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-red-200 border border-red-600 inline-block flex-none" />
            <span className="text-[9px] text-gray-500">0 = falta</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-green-200 border border-green-600 inline-block flex-none" />
            <span className="text-[9px] text-gray-500">1 = tenho</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-blue-200 border border-blue-600 inline-block flex-none" />
            <span className="text-[9px] text-gray-500">2+ = repetida</span>
          </span>
        </div>
      </div>

      {/* Grid preenche a altura disponível — nunca exige scroll */}
      <div
        className="flex-1 min-h-0 grid grid-cols-3 gap-1.5 pb-2"
        style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}
      >
        {numeros.map((n) => {
          const codigo = `${selecaoAtiva}-${n}`;
          return (
            <FigurinhaCard
              key={codigo}
              codigo={codigo}
              quantidade={getQuantidade(codigo)}
              onIncrementar={() => incrementar(codigo)}
              onDecrementar={() => decrementar(codigo)}
            />
          );
        })}
      </div>
    </section>
  );
}
