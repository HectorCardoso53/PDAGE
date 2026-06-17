'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiFetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Credenciais inválidas.');
        return;
      }

      localStorage.setItem('meritus_admin_token', data.access_token);
      router.push('/admin');
    } catch {
      setError('Erro de conexão. Tente novamente.');
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
          <h1 className="text-2xl font-bold text-white mb-1">Painel Administrativo</h1>
          <p className="text-sm" style={{ color: '#ffd21f' }}>Meritus · Gestores Escolares · SEMED</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
          <p className="text-sm text-gray-500 text-center -mt-1">
            Acesso restrito à equipe da Secretaria de Educação.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Login</label>
            <input
              required
              type="text"
              value={login}
              onChange={e => setLogin(e.target.value)}
              placeholder="login de administrador"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              required
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
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
            {loading ? 'Entrando...' : 'Acessar painel'}
          </button>
        </form>
      </div>

      <a href="/" className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors">
        ← Voltar ao início
      </a>
    </div>
  );
}
