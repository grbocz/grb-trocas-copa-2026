import { useState } from 'react';
import { useColecao } from './hooks/useColecao';
import Home from './pages/Home';
import MinhaColecao from './pages/MinhaColecao';
import Trocas from './pages/Trocas';
import FiltroFigurinhas, { FiltroTipo } from './pages/FiltroFigurinhas';

type Tela = 'home' | 'colecao' | 'trocas' | 'filtro';

export default function App() {
  const [tela, setTela] = useState<Tela>('home');
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroTipo>('tenho');
  const { nome, colecao, getQuantidade, incrementar, decrementar, setNome, exportar } =
    useColecao();

  if (tela === 'colecao') {
    return (
      <MinhaColecao
        nome={nome}
        getQuantidade={getQuantidade}
        incrementar={incrementar}
        decrementar={decrementar}
        setNome={setNome}
        exportar={exportar}
        onHome={() => setTela('home')}
        onVerTrocas={() => setTela('trocas')}
      />
    );
  }

  if (tela === 'trocas') {
    return <Trocas colecao={colecao} onVoltar={() => setTela('home')} />;
  }

  if (tela === 'filtro') {
    return (
      <FiltroFigurinhas
        filtro={filtroAtivo}
        colecao={colecao}
        incrementar={incrementar}
        decrementar={decrementar}
        onVoltar={() => setTela('home')}
      />
    );
  }

  return (
    <Home
      colecao={colecao}
      onMinhaColecao={() => setTela('colecao')}
      onTrocas={() => setTela('trocas')}
      onFiltro={(f) => { setFiltroAtivo(f); setTela('filtro'); }}
    />
  );
}
