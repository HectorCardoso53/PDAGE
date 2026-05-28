import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Painel Administrativo',
};

export default function AdminPage() {
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-gray-400 text-lg">Secretaria de Educação</p>
        </div>

        <div className="bg-primary-800 border border-white/10 rounded-2xl p-8 mb-6">
          <div className="inline-flex items-center gap-2 bg-accent-500/10 border border-accent-500/30 text-accent-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
            Em desenvolvimento
          </div>
          <p className="text-gray-300 text-base leading-relaxed">
            O painel administrativo é exclusivo para servidores da Secretaria Municipal de Educação.
            Esta área permitirá o gerenciamento completo do processo avaliativo. Em breve disponível.
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
