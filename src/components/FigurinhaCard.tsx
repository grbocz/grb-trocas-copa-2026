interface Props {
  codigo: string;
  quantidade: number;
  onIncrementar: () => void;
  onDecrementar: () => void;
}

export default function FigurinhaCard({ codigo, quantidade, onIncrementar, onDecrementar }: Props) {
  const bgBorder =
    quantidade === 0
      ? 'bg-red-50 border-red-400'
      : quantidade === 1
        ? 'bg-green-50 border-green-400'
        : 'bg-blue-50 border-blue-400';

  const counterColor =
    quantidade === 0
      ? 'text-red-600'
      : quantidade === 1
        ? 'text-green-700'
        : 'text-blue-700';

  return (
    <div className={`border rounded-lg flex flex-col items-center justify-between py-1 px-0.5 ${bgBorder}`}>
      <span className="text-[9px] text-gray-500 font-medium leading-none">{codigo}</span>
      <span className={`text-xl font-bold leading-none my-0.5 ${counterColor}`}>{quantidade}</span>
      <div className="flex gap-1">
        <button
          onClick={onDecrementar}
          disabled={quantidade === 0}
          className="w-6 h-6 rounded-full bg-white border border-gray-300 text-gray-700 text-sm font-bold flex items-center justify-center active:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm leading-none"
        >
          −
        </button>
        <button
          onClick={onIncrementar}
          className="w-6 h-6 rounded-full bg-white border border-gray-300 text-gray-700 text-sm font-bold flex items-center justify-center active:bg-gray-100 shadow-sm leading-none"
        >
          +
        </button>
      </div>
    </div>
  );
}
