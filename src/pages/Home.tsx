import { useRef, useState } from 'react';
import { getTotalFigurinhas } from '../data/album';
import { FiltroTipo } from './FiltroFigurinhas';

interface Props {
  colecao: Record<string, number>;
  onMinhaColecao: () => void;
  onTrocas: () => void;
  onFiltro: (filtro: FiltroTipo) => void;
  onRestaurarBackup: (dados: { nome: string; colecao: Record<string, number> }) => void;
}

const TOTAL = getTotalFigurinhas();

export default function Home({ colecao, onMinhaColecao, onTrocas, onFiltro, onRestaurarBackup }: Props) {
  const valores = Object.values(colecao);
  const tenho = valores.filter((v) => v >= 1).length;
  const repetidas = valores.filter((v) => v >= 2).length;
  const faltam = TOTAL - tenho;
  const percentual = TOTAL > 0 ? Math.round((tenho / TOTAL) * 100) : 0;

  const inputRef = useRef<HTMLInputElement>(null);
  const [feedbackBackup, setFeedbackBackup] = useState('');

  function handleBackupFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100_000) {
      setFeedbackBackup('Arquivo muito grande.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const dados = JSON.parse(ev.target?.result as string);
        if (!dados.colecao || !dados.nome) throw new Error();
        const info = dados.exportadoEm ? ` (${dados.exportadoEm})` : '';
        const ok = window.confirm(
          `Restaurar backup de "${dados.nome}"${info}?\n\nIsso vai substituir sua coleção atual.`
        );
        if (!ok) return;
        onRestaurarBackup({ nome: dados.nome, colecao: dados.colecao });
        setFeedbackBackup(`Backup de ${dados.nome} restaurado!`);
        setTimeout(() => setFeedbackBackup(''), 3000);
      } catch {
        setFeedbackBackup('Arquivo inválido. Use um backup exportado pelo app.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="flex-none bg-blue-600 text-white px-4 py-4 shadow-md">
        <h1 className="text-lg font-bold leading-none">Copa 2026</h1>
        <p className="text-xs opacity-75 mt-0.5">Trocas de Figurinhas</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-end justify-between mb-2">
            <span className="text-sm font-bold text-gray-700">Progresso</span>
            <span className="text-2xl font-bold text-blue-600">{percentual}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div className="h-3 rounded-full bg-blue-500 transition-all" style={{ width: `${percentual}%` }} />
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 text-right">{tenho} de {TOTAL} figurinhas</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => onFiltro('tenho')} className="bg-green-50 border border-green-200 rounded-xl p-3 text-center active:bg-green-100 transition-colors">
            <div className="text-2xl font-bold text-green-700">{tenho}</div>
            <div className="text-[10px] text-green-600 font-medium mt-0.5">Já tenho</div>
            <div className="text-[9px] text-green-400 mt-1">ver lista →</div>
          </button>
          <button onClick={() => onFiltro('faltam')} className="bg-red-50 border border-red-200 rounded-xl p-3 text-center active:bg-red-100 transition-colors">
            <div className="text-2xl font-bold text-red-600">{faltam}</div>
            <div className="text-[10px] text-red-500 font-medium mt-0.5">Faltam</div>
            <div className="text-[9px] text-red-300 mt-1">ver lista →</div>
          </button>
          <button onClick={() => onFiltro('repetidas')} className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center active:bg-blue-100 transition-colors">
            <div className="text-2xl font-bold text-blue-700">{repetidas}</div>
            <div className="text-[10px] text-blue-600 font-medium mt-0.5">Repetidas</div>
            <div className="text-[9px] text-blue-300 mt-1">ver lista →</div>
          </button>
        </div>

        <div className="space-y-3 pt-2">
          <button onClick={onMinhaColecao} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 text-sm font-bold active:opacity-80 transition-colors flex items-center justify-between px-5">
            <span>Minha Coleção</span>
            <span className="text-lg opacity-80">→</span>
          </button>
          <button onClick={onTrocas} className="w-full bg-gray-600 hover:bg-gray-700 text-white rounded-xl py-4 text-sm font-bold active:opacity-80 transition-colors flex items-center justify-between px-5">
            <span>Ver Trocas</span>
            <span className="text-lg opacity-80">→</span>
          </button>

          <input ref={inputRef} type="file" accept=".json,.txt" onChange={handleBackupFile} className="hidden" />
          <button
            onClick={() => { setFeedbackBackup(''); inputRef.current?.click(); }}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-xl py-4 text-sm font-bold active:opacity-80 transition-colors flex items-center justify-between px-5"
          >
            <span>Restaurar backup</span>
            <span className="text-lg opacity-60">↑</span>
          </button>

          {feedbackBackup && (
            <p className={`text-xs text-center font-medium ${feedbackBackup.includes('restaurado') ? 'text-green-600' : 'text-red-500'}`}>
              {feedbackBackup}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
