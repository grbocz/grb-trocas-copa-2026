import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'trocas-copa-2026';

interface ColecaoState {
  nome: string;
  colecao: Record<string, number>;
}

const defaultState: ColecaoState = { nome: '', colecao: {} };

function loadFromStorage(): ColecaoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ColecaoState;
  } catch {
    // ignore parse errors
  }
  return defaultState;
}

function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function useColecao() {
  const [state, setState] = useState<ColecaoState>(loadFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state]);

  const getQuantidade = useCallback(
    (figurinha: string) => state.colecao[figurinha] ?? 0,
    [state.colecao]
  );

  const incrementar = useCallback((figurinha: string) => {
    setState((prev) => ({
      ...prev,
      colecao: { ...prev.colecao, [figurinha]: (prev.colecao[figurinha] ?? 0) + 1 },
    }));
  }, []);

  const decrementar = useCallback((figurinha: string) => {
    setState((prev) => {
      const atual = prev.colecao[figurinha] ?? 0;
      if (atual <= 0) return prev;
      const novaColecao = { ...prev.colecao };
      if (atual === 1) {
        delete novaColecao[figurinha];
      } else {
        novaColecao[figurinha] = atual - 1;
      }
      return { ...prev, colecao: novaColecao };
    });
  }, []);

  const setNome = useCallback((nome: string) => {
    setState((prev) => ({ ...prev, nome }));
  }, []);

  const exportar = useCallback(() => {
    const nomeExport = state.nome.trim() || 'sem_nome';
    const agora = new Date();

    const exportadoEm = agora.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });

    const dataArquivo = agora.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const horaArquivo = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');

    const data = {
      nome: nomeExport,
      versao: '1',
      exportadoEm,
      colecao: state.colecao,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const filename = `colecao_${nomeExport}_${dataArquivo}_${horaArquivo}.json`;

    if (navigator.share) {
      const file = new File([blob], filename, { type: 'application/json' });
      navigator
        .share({ files: [file], title: 'Minha coleção Copa 2026' })
        .catch(() => downloadFile(blob, filename));
    } else {
      downloadFile(blob, filename);
    }
  }, [state]);

  const aplicarLote = useCallback((lote: Record<string, number>) => {
    setState((prev) => {
      const novaColecao = { ...prev.colecao };
      for (const [figurinha, quantidade] of Object.entries(lote)) {
        if (quantidade <= 0) {
          delete novaColecao[figurinha];
        } else {
          novaColecao[figurinha] = quantidade;
        }
      }
      return { ...prev, colecao: novaColecao };
    });
  }, []);

  return {
    nome: state.nome,
    colecao: state.colecao,
    getQuantidade,
    incrementar,
    decrementar,
    aplicarLote,
    setNome,
    exportar,
  };
}
