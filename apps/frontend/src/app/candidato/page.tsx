import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Painel do Candidato',
};

export default function CandidatoPage() {
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
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Painel do Candidato</h1>
          <p className="text-gray-400 text-lg">Área Restrita</p>
        </div>

        <div className="bg-primary-800 border border-white/10 rounded-2xl p-8 mb-6">
          <div className="inline-flex items-center gap-2 bg-accent-500/10 border border-accent-500/30 text-accent-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
            Em desenvolvimento
          </div>
          <p className="text-gray-300 text-base leading-relaxed">
            O painel do candidato permitirá acompanhar todas as etapas do processo avaliativo em
            tempo real, enviar documentos e consultar resultados. Em breve disponível.
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
