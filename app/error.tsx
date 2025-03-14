'use client';

import { useEffect } from 'react';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-4">Algo deu errado!</h2>
        <p className="text-lg text-gray-600 mb-6">
          Ocorreu um erro ao processar sua solicitação.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}