export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <h2 className="text-xl font-medium text-gray-700">Carregando...</h2>
        <p className="text-gray-500 mt-2">Aguarde um momento enquanto buscamos os dados.</p>
      </div>
    </div>
  );
}