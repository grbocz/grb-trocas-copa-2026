import { useMemo } from 'react';
import { Selecao, SecaoEspecial } from '../data/album';

interface Props {
  selecoes: Selecao[];
  grupos: string[];
  especiais: SecaoEspecial[];
  selecaoAtiva: string;
  ordenacao: 'grupos' | 'az';
  onSelecionar: (codigo: string) => void;
  onOrdenacaoChange: (o: 'grupos' | 'az') => void;
}

interface CardProps {
  codigo: string;
  nome: string;
  ativa: boolean;
  onClick: () => void;
}

function ItemCard({ codigo, nome, ativa, onClick }: CardProps) {
  return (
    <button
      onClick={onClick}
      className={`p-1 text-center border-b border-r border-gray-100 transition-colors w-full ${
        ativa ? 'bg-blue-50 ring-1 ring-inset ring-blue-400' : 'bg-white active:bg-gray-50'
      }`}
    >
      <div className={`text-sm font-bold leading-tight ${ativa ? 'text-blue-700' : 'text-gray-800'}`}>
        {codigo}
      </div>
      <div className="text-[8px] text-gray-400 truncate leading-tight">{nome}</div>
    </button>
  );
}

export default function SelecoesPanel({
  selecoes,
  grupos,
  especiais,
  selecaoAtiva,
  ordenacao,
  onSelecionar,
  onOrdenacaoChange,
}: Props) {
  const porGrupo = useMemo(() => {
    const map: Record<string, Selecao[]> = {};
    for (const g of grupos) {
      map[g] = selecoes.filter((s) => s.grupo === g);
    }
    return map;
  }, [selecoes, grupos]);

  const emAZ = useMemo(
    () => [...selecoes].sort((a, b) => a.codigo.localeCompare(b.codigo)),
    [selecoes]
  );

  const secaoEspeciais = (
    <div>
      <div className="px-2 py-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 border-b border-amber-100 uppercase tracking-wide">
        Especiais
      </div>
      <div className="grid grid-cols-2">
        {especiais.map((e) => (
          <ItemCard
            key={e.codigo}
            codigo={e.codigo}
            nome={e.nome}
            ativa={selecaoAtiva === e.codigo}
            onClick={() => onSelecionar(e.codigo)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <aside className="w-[130px] flex-none bg-white border-r border-gray-200 flex flex-col">
      {/* Toggle Grupos / A–Z */}
      <div className="flex-none p-1.5 border-b border-gray-100">
        <div className="flex bg-gray-100 rounded overflow-hidden text-[10px] font-medium">
          <button
            onClick={() => onOrdenacaoChange('grupos')}
            className={`flex-1 py-1 transition-colors ${
              ordenacao === 'grupos' ? 'bg-blue-600 text-white' : 'text-gray-600'
            }`}
          >
            Grupos
          </button>
          <button
            onClick={() => onOrdenacaoChange('az')}
            className={`flex-1 py-1 transition-colors ${
              ordenacao === 'az' ? 'bg-blue-600 text-white' : 'text-gray-600'
            }`}
          >
            A–Z
          </button>
        </div>
      </div>

      {/* Lista de seleções + especiais */}
      <div className="flex-1 overflow-y-auto">
        {ordenacao === 'grupos' ? (
          <>
            {grupos.map((g) => (
              <div key={g}>
                <div className="px-2 py-0.5 text-[10px] font-bold text-gray-400 bg-gray-50 border-b border-gray-100 uppercase tracking-wide">
                  Grupo {g}
                </div>
                <div className="grid grid-cols-2">
                  {porGrupo[g].map((s) => (
                    <ItemCard
                      key={s.codigo}
                      codigo={s.codigo}
                      nome={s.nome}
                      ativa={selecaoAtiva === s.codigo}
                      onClick={() => onSelecionar(s.codigo)}
                    />
                  ))}
                </div>
              </div>
            ))}
            {secaoEspeciais}
          </>
        ) : (
          <>
            <div className="grid grid-cols-2">
              {emAZ.map((s) => (
                <ItemCard
                  key={s.codigo}
                  codigo={s.codigo}
                  nome={s.nome}
                  ativa={selecaoAtiva === s.codigo}
                  onClick={() => onSelecionar(s.codigo)}
                />
              ))}
            </div>
            {secaoEspeciais}
          </>
        )}
      </div>
    </aside>
  );
}
