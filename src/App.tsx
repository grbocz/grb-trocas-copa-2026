import { useState } from 'react';
import { useColecao, urlParaColecao } from './hooks/useColecao';
import Home from './pages/Home';
import MinhaColecao from './pages/MinhaColecao';
import Trocas from './pages/Trocas';
import FiltroFigurinhas, { FiltroTipo } from './pages/FiltroFigurinhas';

type Tela = 'home' | 'colecao' | 'trocas' | 'filtro';

function lerColecaoDaUrl() {
  const dados = urlParaColecao(window.location.search);
  if (dados) {
    history.replaceState(null, '', window.location.pathname);
  }
  return dados;
}

export default function App() {
  const [tela, setTela] = useState<Tela>(() => urlParaColecao(window.location.search) ? 'trocas' : 'home');
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroTipo>('tenho');
  const [colecaoViaUrl] = useState(lerColecaoDaUrl);
  const { nome, colecao, getQuantidade, incrementar, decrementar, aplicarLote, restaurarBackup, setNome, exportar } =
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
    return <Trocas colecao={colecao} colecaoPreCarregada={colecaoViaUrl} onVoltar={() => setTela('home')} />;
  }

  if (tela === 'filtro') {
    return (
      <FiltroFigurinhas
        filtro={filtroAtivo}
        colecao={colecao}
        aplicarLote={aplicarLote}
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
      onRestaurarBackup={restaurarBackup}
    />
  );
}
