import { useState } from 'react';
import { SELECOES, GRUPOS, ESPECIAIS } from '../data/album';
import SelecoesPanel from '../components/SelecoesPanel';
import FigurinhasPanel from '../components/FigurinhasPanel';

interface Props {
  nome: string;
  getQuantidade: (figurinha: string) => number;
  incrementar: (figurinha: string) => void;
  decrementar: (figurinha: string) => void;
  setNome: (nome: string) => void;
  exportar: () => void;
  onHome: () => void;
  onVerTrocas: () => void;
}

export default function MinhaColecao({
  nome,
  getQuantidade,
  incrementar,
  decrementar,
  setNome,
  exportar,
  onHome,
  onVerTrocas,
}: Props) {
  const [selecaoAtiva, setSelecaoAtiva] = useState('BRA');
  const [ordenacao, setOrdenacao] = useState<'grupos' | 'az'>('grupos');

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="flex-none bg-blue-600 text-white px-3 py-2 shadow-md">
        <div className="flex items-center gap-2">
          {/* Botão home */}
          <button
            onClick={onHome}
            className="flex-none w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-400 active:bg-blue-700 transition-colors text-base"
            aria-label="Menu principal"
          >
            ⌂
          </button>

          {/* Título */}
          <div className="flex-1 leading-tight min-w-0">
            <div className="text-xs font-bold tracking-wide">MINHA COLEÇÃO</div>
            <div className="text-[10px] opacity-75">Copa 2026</div>
          </div>

          {/* Nome */}
          <div className="flex items-center gap-1.5 flex-none">
            <span className="text-[10px] opacity-75">Nome:</span>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="text-xs bg-blue-500 text-white placeholder-blue-300 border border-blue-400 rounded px-2 py-0.5 w-24 focus:outline-none focus:border-white"
            />
          </div>
        </div>
      </header>

      {/* Corpo: duas colunas */}
      <main className="flex flex-1 min-h-0">
        <SelecoesPanel
          selecoes={SELECOES}
          grupos={GRUPOS}
          especiais={ESPECIAIS}
          selecaoAtiva={selecaoAtiva}
          ordenacao={ordenacao}
          onSelecionar={setSelecaoAtiva}
          onOrdenacaoChange={setOrdenacao}
        />
        <FigurinhasPanel
          selecaoAtiva={selecaoAtiva}
          getQuantidade={getQuantidade}
          incrementar={incrementar}
          decrementar={decrementar}
        />
      </main>

      {/* Footer */}
      <footer className="flex-none bg-white border-t border-gray-200 px-3 py-2.5 flex gap-2.5">
        <button
          onClick={exportar}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg py-2.5 text-sm font-semibold active:opacity-80 transition-colors"
        >
          Exportar
        </button>
        <button
          onClick={onVerTrocas}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm font-semibold active:opacity-80 transition-colors"
        >
          Ver trocas
        </button>
      </footer>
    </div>
  );
}
