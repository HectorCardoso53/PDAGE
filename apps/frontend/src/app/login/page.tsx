'use client';

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, X } from 'lucide-react';
import { apiFetch } from '@/lib/api';

function ResetSenhaModal({ onClose }: { onClose: () => void }) {
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [showNova, setShowNova] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const formatCpf = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (novaSenha.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmar) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/reset-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: cpf.replace(/\D/g, ''),
          dataNascimento: dataNasc,
          novaSenha,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Não foi possível redefinir a senha.');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

        <div className="flex items-center justify-between px-6 py-4" style={{ background: '#001b3d' }}>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Meritus" width={32} height={32} className="drop-shadow" />
            <h2 className="text-base font-bold text-white">Redefinir senha</h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="px-8 py-10 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#dcfce7' }}>
              <svg className="w-7 h-7" fill="none" stroke="#16a34a" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-bold text-gray-800 mb-1">Senha redefinida!</p>
            <p className="text-sm text-gray-500 mb-6">Você já pode fazer login com a nova senha.</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-white"
              style={{ background: '#001b3d' }}
            >
              Ir para o login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
            <p className="text-sm text-gray-500">
              Informe seu CPF e data de nascimento para verificar sua identidade e definir uma nova senha.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input
                required
                type="text"
                inputMode="numeric"
                value={cpf}
                onChange={e => setCpf(formatCpf(e.target.value))}
                placeholder="000.000.000-00"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de nascimento</label>
              <input
                required
                type="date"
                value={dataNasc}
                onChange={e => setDataNasc(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label>
              <div className="relative">
                <input
                  required
                  type={showNova ? 'text' : 'password'}
                  value={novaSenha}
                  onChange={e => setNovaSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <button type="button" tabIndex={-1} onClick={() => setShowNova(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNova ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nova senha</label>
              <div className="relative">
                <input
                  required
                  type={showConfirmar ? 'text' : 'password'}
                  value={confirmar}
                  onChange={e => setConfirmar(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <button type="button" tabIndex={-1} onClick={() => setShowConfirmar(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
              {loading ? 'Salvando...' : 'Redefinir senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!redirecting) return;
    setProgress(0);
    const steps = [20, 55, 80, 100];
    const delays = [100, 350, 600, 900];
    const timers = steps.map((p, i) =>
      setTimeout(() => setProgress(p), delays[i])
    );
    const nav = setTimeout(() => router.push('/candidato'), 1100);
    return () => { timers.forEach(clearTimeout); clearTimeout(nav); };
  }, [redirecting, router]);

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
      setRedirecting(true);
    } catch {
      setError('Erro de conexão. Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  };

  if (redirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#001b3d' }}>
        <Image src="/logo.png" alt="Meritus" width={64} height={64} className="drop-shadow-lg mb-6" />
        <p className="text-white font-bold text-lg mb-1">Carregando sua área</p>
        <p className="text-sm mb-8" style={{ color: '#a8beca' }}>Aguarde um instante...</p>
        <div className="w-64 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%`, background: '#ffd21f' }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {showReset && <ResetSenhaModal onClose={() => setShowReset(false)} />}

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
              <div className="text-right mt-1.5">
                <button
                  type="button"
                  onClick={() => setShowReset(true)}
                  className="text-xs font-medium hover:underline"
                  style={{ color: '#38b6ff' }}
                >
                  Esqueci minha senha
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
    </>
  );
}
