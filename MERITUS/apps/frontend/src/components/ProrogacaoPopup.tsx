'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProrogacaoPopup() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fechado = localStorage.getItem('popup_prorrogacao_09jun');
    if (!fechado) setVisible(true);
  }, []);

  const fechar = () => {
    localStorage.setItem('popup_prorrogacao_09jun', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={e => { if (e.target === e.currentTarget) fechar(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Topo */}
        <div className="px-6 py-5 text-center" style={{ background: '#001b3d' }}>
          <img src="/logo.png" alt="Logo Prefeitura" className="w-14 h-14 object-contain mx-auto mb-1" />
          <h2 className="text-lg font-extrabold text-white">Prazo Prorrogado!</h2>
          <p className="text-xs mt-1" style={{ color: '#ffd21f' }}>Aviso Oficial — SEMED Oriximiná</p>
        </div>

        <div style={{ height: '3px', background: '#ffd21f' }} />

        {/* Corpo */}
        <div className="px-6 py-6 text-center">
          <p className="text-gray-700 text-sm leading-relaxed">
            As inscrições para o <strong>Processo Seletivo de Gestores Escolares</strong> foram
            <span className="text-green-700 font-bold"> prorrogadas</span>. Novo prazo:
          </p>
          <div className="my-4 py-3 px-4 rounded-xl font-extrabold text-xl" style={{ background: '#f0fdf4', color: '#15803d', border: '2px solid #86efac' }}>
            até 09 de junho de 2026
          </div>
          <p className="text-gray-500 text-xs mb-5">
            Ainda não fez sua inscrição? Aproveite e garanta sua participação agora!
          </p>

          <button
            onClick={() => { fechar(); router.push('/inscricao'); }}
            className="w-full py-3 rounded-xl font-extrabold text-white text-sm transition-opacity hover:opacity-90"
            style={{ background: '#001b3d' }}
          >
            Fazer minha inscrição →
          </button>

          <button
            onClick={fechar}
            className="mt-3 w-full py-2 rounded-xl text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Já me inscrevi — fechar
          </button>
        </div>
      </div>
    </div>
  );
}
