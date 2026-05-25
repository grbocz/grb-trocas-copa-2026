import { useState, useRef } from 'react';
import { SELECOES } from '../data/album';

interface Props {
  colecao: Record<string, number>;
  onVoltar: () => void;
}

interface ColecaoImportada {
  nome: string;
  versao: string;
  colecao: Record<string, number>;
}

function todasFigurinhas(): string[] {
  const all: string[] = [];
  for (const s of SELECOES) {
    for (let i = 1; i <= 20; i++) {
      all.push(`${s.codigo}-${i}`);
    }
  }
  return all.sort((a, b) => {
    const [ca, na] = a.split('-');
    const [cb, nb] = b.split('-');
    if (ca !== cb) return ca.localeCompare(cb);
    return parseInt(na) - parseInt(nb);
  });
}

const TODAS = todasFigurinhas();

export default function Trocas({ colecao, onVoltar }: Props) {
  const [importada, setImportada] = useState<ColecaoImportada | null>(null);
  const [erro, setErro] = useState('');
  const [copiado, setCopiado] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100_000) {
      setErro('Arquivo muito grande. Use um arquivo exportado pelo app.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as ColecaoImportada;
        if (!data.colecao || !data.nome) throw new Error('Formato inválido');
        setImportada(data);
        setErro('');
      } catch {
        setErro('Arquivo inválido. Use um arquivo exportado pelo app.');
        setImportada(null);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  async function copiarLista(titulo: string, lista: string[]) {
    const texto = `${titulo}:\n${lista.join(', ')}`;
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(titulo);
      setTimeout(() => setCopiado(''), 2000);
    } catch {
      // fallback: alert
      alert(`Copie manualmente:\n\n${texto}`);
    }
  }

  const eleTem: string[] = [];
  const voceTem: string[] = [];

  if (importada) {
    for (const f of TODAS) {
      const meu = colecao[f] ?? 0;
      const dele = importada.colecao[f] ?? 0;
      if (dele > 1 && meu === 0) eleTem.push(f);
      if (meu > 1 && dele === 0) voceTem.push(f);
    }
  }

  const nenhuma = importada && eleTem.length === 0 && voceTem.length === 0;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="flex-none bg-blue-600 text-white px-3 py-2 shadow-md flex items-center gap-3">
        <button
          onClick={onVoltar}
          className="text-white opacity-80 hover:opacity-100 text-lg font-bold w-8 h-8 flex items-center justify-center rounded active:bg-blue-700"
        >
          ←
        </button>
        <div className="leading-tight">
          <div className="text-xs font-bold tracking-wide">TROCAS</div>
          <div className="text-[10px] opacity-75">Copa do Mundo 2026</div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Importar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-700 mb-3">
            Importar coleção do amigo
          </h2>
          <input
            ref={inputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 text-sm font-semibold active:opacity-80 transition-colors"
          >
            {importada
              ? `Reimportar (atual: ${importada.nome})`
              : 'Selecionar arquivo .json'}
          </button>
          {erro && <p className="text-red-500 text-xs mt-2">{erro}</p>}
          {importada && !erro && (
            <p className="text-green-600 text-xs mt-2 font-medium">
              Coleção de <strong>{importada.nome}</strong> carregada
            </p>
          )}
        </div>

        {importada && (
          <>
            {nenhuma && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                <p className="text-yellow-700 text-sm font-medium">
                  Nenhuma troca possível por enquanto
                </p>
                <p className="text-yellow-600 text-xs mt-1">
                  Continuem marcando as figurinhas!
                </p>
              </div>
            )}

            {/* Ele tem, você precisa */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-green-700">
                  {importada.nome} tem → você precisa
                </h3>
                {eleTem.length > 0 && (
                  <button
                    onClick={() =>
                      copiarLista(`${importada.nome} tem, você precisa`, eleTem)
                    }
                    className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                      copiado === `${importada.nome} tem, você precisa`
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 active:bg-green-200'
                    }`}
                  >
                    {copiado === `${importada.nome} tem, você precisa` ? 'Copiado!' : 'Copiar lista'}
                  </button>
                )}
              </div>
              {eleTem.length > 0 ? (
                <>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    {eleTem.join(', ')}
                  </p>
                  <p className="text-[10px] text-green-600 mt-1.5 font-medium">
                    {eleTem.length} figurinha{eleTem.length !== 1 ? 's' : ''}
                  </p>
                </>
              ) : (
                <p className="text-xs text-gray-400 italic">Nenhuma disponível</p>
              )}
            </div>

            {/* Você tem, ele precisa */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-blue-700">
                  Você tem → {importada.nome} precisa
                </h3>
                {voceTem.length > 0 && (
                  <button
                    onClick={() =>
                      copiarLista(`Você tem, ${importada.nome} precisa`, voceTem)
                    }
                    className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                      copiado === `Você tem, ${importada.nome} precisa`
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-700 active:bg-blue-200'
                    }`}
                  >
                    {copiado === `Você tem, ${importada.nome} precisa` ? 'Copiado!' : 'Copiar lista'}
                  </button>
                )}
              </div>
              {voceTem.length > 0 ? (
                <>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    {voceTem.join(', ')}
                  </p>
                  <p className="text-[10px] text-blue-600 mt-1.5 font-medium">
                    {voceTem.length} figurinha{voceTem.length !== 1 ? 's' : ''}
                  </p>
                </>
              ) : (
                <p className="text-xs text-gray-400 italic">Nenhuma disponível</p>
              )}
            </div>
          </>
        )}

        {!importada && (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">📂</div>
            <p className="text-gray-400 text-sm">
              Importe o arquivo de um amigo para ver as trocas possíveis
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
