import FigurinhaCard from './FigurinhaCard';

interface Props {
  selecaoAtiva: string;
  getQuantidade: (figurinha: string) => number;
  incrementar: (figurinha: string) => void;
  decrementar: (figurinha: string) => void;
}

const NUMEROS = Array.from({ length: 20 }, (_, i) => i + 1);

export default function FigurinhasPanel({ selecaoAtiva, getQuantidade, incrementar, decrementar }: Props) {
  return (
    <section className="flex-1 flex flex-col min-w-0 bg-gray-50 overflow-hidden">
      {/* Subtítulo e legenda — fixos no topo */}
      <div className="flex-none px-2 pt-2 pb-1.5">
        <h2 className="text-xs font-semibold text-gray-700 leading-none">
          {selecaoAtiva}-1 até {selecaoAtiva}-20
        </h2>
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

      {/* Grid de figurinhas — 3 colunas, scroll vertical quando necessário */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <div className="grid grid-cols-3 gap-1.5">
          {NUMEROS.map((n) => {
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
      </div>
    </section>
  );
}
