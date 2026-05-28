import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recursos',
};

export default function RecursosPage() {
  return (
    <div className="min-h-screen bg-primary-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-700 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-accent-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Recursos e Contestações</h1>
          <p className="text-gray-400 text-lg">Interposição de Recursos</p>
        </div>

        <div className="bg-primary-800 border border-white/10 rounded-2xl p-8 mb-6">
          <div className="inline-flex items-center gap-2 bg-accent-500/10 border border-accent-500/30 text-accent-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
            Em desenvolvimento
          </div>
          <p className="text-gray-300 text-base leading-relaxed">
            O sistema de recursos permitirá aos candidatos interpor contestações sobre resultados de
            etapas avaliativas de forma online, com rastreabilidade e prazos controlados pelo
            sistema. Em breve disponível.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 font-medium transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
