import { getTotalFigurinhas } from '../data/album';

interface Props {
  colecao: Record<string, number>;
  onMinhaColecao: () => void;
  onTrocas: () => void;
}

const TOTAL = getTotalFigurinhas();

export default function Home({ colecao, onMinhaColecao, onTrocas }: Props) {
  const valores = Object.values(colecao);
  const tenho = valores.filter((v) => v >= 1).length;
  const repetidas = valores.filter((v) => v >= 2).length;
  const faltam = TOTAL - tenho;
  const percentual = TOTAL > 0 ? Math.round((tenho / TOTAL) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="flex-none bg-blue-600 text-white px-4 py-4 shadow-md">
        <h1 className="text-lg font-bold leading-none">Copa 2026</h1>
        <p className="text-xs opacity-75 mt-0.5">Trocas de Figurinhas</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Progresso */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-end justify-between mb-2">
            <span className="text-sm font-bold text-gray-700">Progresso</span>
            <span className="text-2xl font-bold text-blue-600">{percentual}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-blue-500 transition-all"
              style={{ width: `${percentual}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 text-right">
            {tenho} de {TOTAL} figurinhas
          </p>
        </div>

        {/* Totalizadores */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-green-700">{tenho}</div>
            <div className="text-[10px] text-green-600 font-medium mt-0.5">Já tenho</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{faltam}</div>
            <div className="text-[10px] text-red-500 font-medium mt-0.5">Faltam</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-blue-700">{repetidas}</div>
            <div className="text-[10px] text-blue-600 font-medium mt-0.5">Repetidas</div>
          </div>
        </div>

        {/* Navegação */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onMinhaColecao}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 text-sm font-bold active:opacity-80 transition-colors flex items-center justify-between px-5"
          >
            <span>Minha Coleção</span>
            <span className="text-lg opacity-80">→</span>
          </button>
          <button
            onClick={onTrocas}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white rounded-xl py-4 text-sm font-bold active:opacity-80 transition-colors flex items-center justify-between px-5"
          >
            <span>Ver Trocas</span>
            <span className="text-lg opacity-80">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
