import { useState } from 'react';
import { useColecao } from './hooks/useColecao';
import MinhaColecao from './pages/MinhaColecao';
import Trocas from './pages/Trocas';

type Tela = 'colecao' | 'trocas';

export default function App() {
  const [tela, setTela] = useState<Tela>('colecao');
  const { nome, colecao, getQuantidade, incrementar, decrementar, setNome, exportar } =
    useColecao();

  if (tela === 'trocas') {
    return <Trocas colecao={colecao} onVoltar={() => setTela('colecao')} />;
  }

  return (
    <MinhaColecao
      nome={nome}
      getQuantidade={getQuantidade}
      incrementar={incrementar}
      decrementar={decrementar}
      setNome={setNome}
      exportar={exportar}
      onVerTrocas={() => setTela('trocas')}
    />
  );
}
