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
    const p = (n: number) => String(n).padStart(2, '0');
    const dia  = p(agora.getDate());
    const mes  = p(agora.getMonth() + 1);
    const ano  = agora.getFullYear();
    const hora = p(agora.getHours());
    const min  = p(agora.getMinutes());

    const data = {
      nome: nomeExport,
      versao: '1',
      exportadoEm: `${dia}/${mes}/${ano} ${hora}:${min}`,
      colecao: state.colecao,
    };

    const texto = JSON.stringify(data);

    if (navigator.share) {
      navigator
        .share({ text: texto, title: `Coleção Copa 2026 - ${nomeExport}` })
        .catch(() => navigator.clipboard?.writeText(texto));
    } else {
      navigator.clipboard?.writeText(texto);
    }
  }, [state]);

  const restaurarBackup = useCallback((dados: { nome: string; colecao: Record<string, number> }) => {
    setState({ nome: dados.nome, colecao: dados.colecao });
  }, []);

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
    restaurarBackup,
    setNome,
    exportar,
  };
}
