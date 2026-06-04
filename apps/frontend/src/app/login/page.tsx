'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'E-mail ou senha incorretos.');
        return;
      }

      localStorage.setItem('meritus_token', data.access_token);
      localStorage.setItem('meritus_candidato', JSON.stringify(data.candidato));
      router.push('/candidato');
    } catch {
      setError('Erro de conexão. Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: '#f4f6f8' }}>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="px-8 pt-8 pb-6 text-center" style={{ background: '#001b3d' }}>
          <div className="flex justify-center mb-3">
            <Image src="/logo.png" alt="Meritus" width={48} height={48} className="drop-shadow" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Área do Candidato</h1>
          <p className="text-sm" style={{ color: '#38b6ff' }}>Meritus · Gestores Escolares · Oriximiná/PA</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
          <p className="text-sm text-gray-500 text-center -mt-1">
            Acesse com seu e-mail e senha cadastrados na inscrição.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <input
                required
                type={showSenha ? 'text' : 'password'}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Sua senha cadastrada na inscrição"
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <button type="button" tabIndex={-1}
                onClick={() => setShowSenha(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-bold text-white transition-opacity disabled:opacity-60"
            style={{ background: '#001b3d' }}
          >
            {loading ? 'Entrando...' : 'Acessar minha área'}
          </button>

        </form>
      </div>

      <a href="/" className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors">
        ← Voltar ao início
      </a>
    </div>
  );
}
