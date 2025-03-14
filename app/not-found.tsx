import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Página não encontrada</h2>
        <p className="text-lg text-gray-600 mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors inline-block"
        >
          Voltar para o Dashboard
        </Link>
      </div>
    </div>
  );
}