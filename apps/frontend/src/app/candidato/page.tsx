'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  FileText, Brain, GraduationCap, ClipboardList,
  BarChart, Award, LogOut, User, CheckCircle,
  Clock, XCircle, Lock, ChevronDown, ChevronUp,
} from 'lucide-react';
import { apiFetch, API_BASE } from '@/lib/api';
import Footer from '@/components/Footer';

type StatusEtapa = 'PENDENTE' | 'EM_ANALISE' | 'APROVADO' | 'REPROVADO';

type Etapa = {
  id: string | null;
  ordem: number;
  tipo: string;
  label: string;
  status: StatusEtapa;
  pontuacao: number | null;
  observacao: string | null;
  recurso: string | null;
  docChecks: string | null;
};

type Inscricao = { id: string; protocolo: string; createdAt: string };

type Candidato = {
  id: string; nome: string; cpf: string; rg: string | null; dataNasc: string | null;
  email: string; telefone: string; cargo: string; escola: string;
  matricula: string; municipio: string;
  docRgCnh: string | null; docCpf: string | null; docResidencia: string | null;
  docTituloEleitor: string | null; docQuitacao: string | null; docReservista: string | null;
  docDiploma: string | null; docPosGraduacao: string | null; docLotacao: string | null;
};

const DOCS_INFO: { field: keyof Candidato; label: string }[] = [
  { field: 'docRgCnh',         label: 'RG ou CNH' },
  { field: 'docCpf',           label: 'CPF' },
  { field: 'docResidencia',    label: 'Comprovante de Residência' },
  { field: 'docTituloEleitor', label: 'Título de Eleitor' },
  { field: 'docQuitacao',      label: 'Quitação Eleitoral' },
  { field: 'docReservista',    label: 'Carteira de Reservista' },
  { field: 'docDiploma',       label: 'Diploma' },
  { field: 'docPosGraduacao',  label: 'Certificado de Pós-grad.' },
  { field: 'docLotacao',       label: 'Comprovante de Lotação' },
];

type DashData = { candidato: Candidato; inscricao: Inscricao | null; etapas: Etapa[] };

const ETAPA_ICONS: Record<string, React.ElementType> = {
  HABILITACAO_DOCUMENTAL: FileText,
  AVALIACAO_COGNITIVA: Brain,
  QUALIFICACAO_CURRICULAR: GraduationCap,
  PLANO_GESTAO: ClipboardList,
  RESULTADO_FINAL: BarChart,
  CERTIFICACAO: Award,
};

function maskCpf(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***.$2.$3-**');
}

export default function CandidatoPage() {
  const router = useRouter();
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedEtapa, setExpandedEtapa] = useState<string | null>('INSCRICAO');
  const [recursoTexto, setRecursoTexto] = useState('');
  const [recursoAberto, setRecursoAberto] = useState<string | null>(null);
  const [recursoSaving, setRecursoSaving] = useState(false);
  const [recursoEnviado, setRecursoEnviado] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('meritus_token');
    if (!token) { router.replace('/login'); return; }

    apiFetch('/api/candidato/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => {
        if (r.status === 401) { router.replace('/login'); return null; }
        return r.json();
      })
      .then(d => { if (d) setData(d); })
      .catch(() => setError('Erro ao carregar os dados. Tente novamente.'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleRecurso = async (etapaId: string) => {
    if (!recursoTexto.trim()) return;
    setRecursoSaving(true);
    const token = localStorage.getItem('meritus_token');
    try {
      const res = await apiFetch(`/api/candidato/etapa/${etapaId}/recurso`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recurso: recursoTexto.trim() }),
      });
      if (res.ok) {
        setRecursoEnviado(etapaId);
        setRecursoAberto(null);
        setRecursoTexto('');
        setData(prev => prev ? {
          ...prev,
          etapas: prev.etapas.map(e =>
            e.id === etapaId ? { ...e, status: 'EM_ANALISE', recurso: recursoTexto.trim() } : e
          ),
        } : null);
      }
    } finally {
      setRecursoSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('meritus_token');
    localStorage.removeItem('meritus_candidato');
    router.replace('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f4f6f8' }}>
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Carregando sua área...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#f4f6f8' }}>
      <div className="text-center max-w-sm">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg text-white text-sm" style={{ background: '#001b3d' }}>
          Tentar novamente
        </button>
      </div>
    </div>
  );

  if (!data) return null;

  const { candidato, inscricao, etapas } = data;

  const inscricaoEtapa = etapas.find(e => e.tipo === 'INSCRICAO');
  const inscricaoReprovada = inscricaoEtapa?.status === 'REPROVADO';
  const allPending = etapas.every(e => e.status === 'PENDENTE');
  const aprovadas  = etapas.filter(e => e.status === 'APROVADO').length;
  const reprovadas = etapas.filter(e => e.status === 'REPROVADO').length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4f6f8' }}>

      {/* Header */}
      <header style={{ background: '#001b3d', borderBottom: '3px solid #ffd21f' }}>
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Meritus" width={32} height={32} className="object-contain" />
            <span className="font-bold text-white text-lg">Meritus</span>
            <span className="hidden sm:inline text-xs text-white/50 ml-1">— Área do Candidato</span>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Notificação: inscrição reprovada */}
        {inscricaoReprovada && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 flex gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-100">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-red-700 mb-1">Inscrição reprovada pela comissão</p>
              {inscricaoEtapa?.observacao ? (
                <p className="text-sm text-red-600 leading-relaxed">
                  <span className="font-semibold">Justificativa: </span>{inscricaoEtapa.observacao}
                </p>
              ) : (
                <p className="text-sm text-red-500">Entre em contato com a secretaria para mais informações.</p>
              )}
            </div>
          </div>
        )}

        {/* Card do candidato */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#001b3d' }}>
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold truncate" style={{ color: '#001b3d' }}>{candidato.nome}</h2>
              <p className="text-sm text-gray-500">{maskCpf(candidato.cpf)}</p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                <span className="text-gray-400">Cargo: <span className="text-gray-700 font-medium">{candidato.cargo}</span></span>
                <span className="text-gray-400">Escola: <span className="text-gray-700 font-medium">{candidato.escola}</span></span>
                <span className="text-gray-400">Matrícula: <span className="text-gray-700 font-medium">{candidato.matricula}</span></span>
                <span className="text-gray-400">Município: <span className="text-gray-700 font-medium">{candidato.municipio}</span></span>
              </div>
            </div>
            {inscricao && (
              <div className="hidden sm:block text-right flex-shrink-0">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Protocolo</p>
                <p className="text-xs font-mono font-semibold text-gray-700 mt-0.5">{inscricao.protocolo}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(inscricao.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Banner: aguardando comissão */}
        {allPending && (
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#f0f7ff' }}>
              <Clock className="w-7 h-7" style={{ color: '#38b6ff' }} />
            </div>
            <h3 className="text-lg font-bold mb-1" style={{ color: '#001b3d' }}>
              Inscrição recebida com sucesso!
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              Você cumpriu todos os requisitos e seus documentos foram enviados.
              A inscrição está agora sob análise da <strong>comissão responsável</strong>.
              Acompanhe o andamento por esta página.
            </p>
            {inscricao && (
              <div className="inline-block mt-4 px-5 py-2 rounded-xl" style={{ background: '#f0f7ff', border: '1.5px solid #38b6ff' }}>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Protocolo de inscrição</p>
                <p className="text-sm font-mono font-bold" style={{ color: '#001b3d' }}>{inscricao.protocolo}</p>
              </div>
            )}
          </div>
        )}

        {/* Stats — só quando processo em andamento */}
        {!allPending && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{aprovadas}</p>
              <p className="text-xs text-gray-500 mt-0.5">Etapas aprovadas</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{reprovadas}</p>
              <p className="text-xs text-gray-500 mt-0.5">Etapas reprovadas</p>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: '#001b3d' }}>{aprovadas}/7</p>
              <p className="text-xs text-gray-500 mt-0.5">Progresso total</p>
            </div>
          </div>
        )}

        {/* Etapas — sempre visíveis e sempre expansíveis */}
        <div className="space-y-3">
          <h3 className="text-base font-bold" style={{ color: '#001b3d' }}>Acompanhamento das Etapas</h3>

          {etapas.map((etapa) => {
            const Icon = ETAPA_ICONS[etapa.tipo] ?? FileText;
            const isPendente = etapa.status === 'PENDENTE';

            const cfg = {
              PENDENTE:   { label: 'Aguardando comissão', color: 'text-gray-400',  bg: 'bg-gray-50',   border: 'border-gray-100',  icon: Lock },
              EM_ANALISE: { label: 'Em análise',          color: 'text-amber-600', bg: 'bg-amber-50',  border: 'border-amber-200', icon: Clock },
              APROVADO:   { label: 'Aprovada',            color: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-200', icon: CheckCircle },
              REPROVADO:  { label: 'Reprovada',           color: 'text-red-600',   bg: 'bg-red-50',    border: 'border-red-200',   icon: XCircle },
            }[etapa.status];

            const StatusIcon = cfg.icon;
            const isReprovado = etapa.status === 'REPROVADO';
            const jaEnviouRecurso = !!etapa.recurso || recursoEnviado === etapa.id;
            const abrindoRecurso = recursoAberto === etapa.tipo;
            const isExpanded = expandedEtapa === etapa.tipo;

            const etapaDocs = etapa.tipo === 'HABILITACAO_DOCUMENTAL'
              ? DOCS_INFO.filter(({ field }) => !!candidato[field])
              : [];

            return (
              <div key={etapa.tipo} className={`bg-white rounded-xl border shadow-sm ${cfg.border}`}>

                {/* Cabeçalho do card — sempre clicável */}
                <div
                  className="p-4 flex items-center gap-4 cursor-pointer select-none"
                  onClick={() => setExpandedEtapa(isExpanded ? null : etapa.tipo)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isPendente ? 'bg-gray-200' : ''}`}
                    style={!isPendente ? { background: '#001b3d' } : {}}>
                    <Icon className={`w-5 h-5 ${isPendente ? 'text-gray-400' : 'text-white'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-mono">0{etapa.ordem}</span>
                      <span className={`text-sm font-semibold ${isPendente ? 'text-gray-400' : 'text-gray-800'}`}>
                        {etapa.label}
                      </span>
                    </div>
                    {etapa.pontuacao !== null && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Pontuação: <span className="font-semibold text-gray-700">{etapa.pontuacao} pts</span>
                      </p>
                    )}
                  </div>
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </span>
                  {isExpanded
                    ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  }
                </div>

                {/* Painel expandido */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-3 space-y-3">

                    {/* INSCRICAO: exibe resumo + documentos enviados */}
                    {etapa.tipo === 'INSCRICAO' && inscricao && (
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Detalhes da Inscrição</p>
                          <div className="px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100 space-y-1.5">
                            <p className="text-xs text-gray-500">Protocolo: <span className="font-mono font-bold text-gray-800">{inscricao.protocolo}</span></p>
                            <p className="text-xs text-gray-500">Data: <span className="text-gray-700">{new Date(inscricao.createdAt).toLocaleDateString('pt-BR')}</span></p>
                            <p className="text-xs text-gray-500">Nome: <span className="text-gray-700">{candidato.nome}</span></p>
                            <p className="text-xs text-gray-500">Escola: <span className="text-gray-700">{candidato.escola}</span></p>
                            <p className="text-xs text-gray-500">Cargo: <span className="text-gray-700">{candidato.cargo}</span></p>
                            <p className="text-xs text-gray-500">Município: <span className="text-gray-700">{candidato.municipio}</span></p>
                          </div>
                        </div>
                        {(() => {
                          const docs = DOCS_INFO.filter(({ field }) => !!candidato[field]);
                          return docs.length > 0 ? (
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Documentos enviados</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {docs.map(({ field, label }) => (
                                  <a key={field}
                                    href={`${API_BASE}/api/uploads/${candidato[field]}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-100 bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors"
                                  >
                                    <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span className="truncate">{label}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}

                    {/* HABILITACAO_DOCUMENTAL: documentos com status de validação do admin */}
                    {etapaDocs.length > 0 && (() => {
                      const checks: Record<string, boolean> = etapa.docChecks
                        ? JSON.parse(etapa.docChecks) : {};
                      const hasChecks = Object.keys(checks).length > 0;
                      return (
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Documentos enviados</p>
                          <div className="space-y-1.5">
                            {etapaDocs.map(({ field, label }) => {
                              const checkVal = checks[field as string];
                              const hasCheck = hasChecks && checkVal !== undefined;
                              return (
                                <div key={field} className={`flex items-center gap-1 rounded-lg border overflow-hidden ${
                                  hasCheck && checkVal  ? 'border-green-200' :
                                  hasCheck && !checkVal ? 'border-red-200'   :
                                  'border-blue-100'
                                }`}>
                                  <a href={`${API_BASE}/api/uploads/${candidato[field]}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className={`flex-1 flex items-center gap-2 px-3 py-2 text-xs font-medium hover:opacity-80 transition-opacity min-w-0 ${
                                      hasCheck && checkVal  ? 'bg-green-50 text-green-700' :
                                      hasCheck && !checkVal ? 'bg-red-50 text-red-700'     :
                                      'bg-blue-50 text-blue-700'
                                    }`}>
                                    <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span className="truncate">{label}</span>
                                  </a>
                                  {hasCheck && (
                                    <span className={`px-2.5 text-sm font-bold flex-shrink-0 ${checkVal ? 'text-green-600' : 'text-red-500'}`}>
                                      {checkVal ? '✓' : '✗'}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          {isPendente && !hasChecks && (
                            <p className="text-xs text-gray-400 mt-2">Documentos aguardando validação pela comissão.</p>
                          )}
                          {hasChecks && (
                            <p className="text-xs text-gray-400 mt-2">
                              ✓ = documento válido &nbsp;·&nbsp; ✗ = documento com problema
                            </p>
                          )}
                        </div>
                      );
                    })()}

                    {/* Observação da comissão (etapas aprovadas/em análise) */}
                    {etapa.observacao && !isReprovado && (
                      <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
                        <p className="text-xs font-semibold text-blue-600 mb-0.5">Observação da comissão:</p>
                        <p className="text-sm text-blue-700">{etapa.observacao}</p>
                      </div>
                    )}

                    {/* PENDENTE sem documentos — etapas futuras */}
                    {isPendente && etapaDocs.length === 0 && etapa.tipo !== 'INSCRICAO' && (
                      <p className="text-xs text-gray-400">Esta etapa ainda não foi iniciada. Aguardando conclusão das etapas anteriores.</p>
                    )}

                    {/* Aprovada/Em análise sem obs nem docs */}
                    {!isPendente && !isReprovado && etapaDocs.length === 0 && !etapa.observacao && etapa.tipo !== 'INSCRICAO' && (
                      <p className="text-xs text-gray-400">Nenhuma informação adicional registrada nesta etapa.</p>
                    )}
                  </div>
                )}

                {/* Seção de reprovação + recurso */}
                {isReprovado && (
                  <div className="border-t border-red-100 px-4 pb-4 pt-3 space-y-3">
                    {etapa.observacao && (
                      <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                        <p className="text-xs font-semibold text-red-600 mb-0.5">Justificativa da comissão:</p>
                        <p className="text-sm text-red-700 leading-relaxed">{etapa.observacao}</p>
                      </div>
                    )}

                    {jaEnviouRecurso ? (
                      <div className="rounded-lg bg-orange-50 border border-orange-200 px-3 py-2 space-y-1">
                        <p className="text-xs font-semibold text-orange-700">Recurso enviado — aguardando reavaliação</p>
                        <p className="text-sm text-orange-800 italic leading-relaxed">{etapa.recurso}</p>
                      </div>
                    ) : (
                      <>
                        {!abrindoRecurso ? (
                          <button
                            onClick={() => { setRecursoAberto(etapa.tipo); setRecursoTexto(''); }}
                            className="w-full py-2 rounded-lg border border-orange-300 text-orange-700 text-xs font-semibold hover:bg-orange-50 transition-colors"
                          >
                            Entrar com Recurso
                          </button>
                        ) : (
                          /* ── Formulário Anexo V ── */
                          <div className="rounded-xl border border-orange-200 bg-orange-50 overflow-hidden text-sm">
                            {/* Cabeçalho oficial */}
                            <div className="bg-white border-b border-orange-200 px-4 py-3 text-center space-y-0.5">
                              <Image src="/brasão.png" alt="Brasão de Oriximiná" width={56} height={56} className="mx-auto mb-2 object-contain" />
                              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Prefeitura Municipal de Oriximiná</p>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Gabinete do Prefeito</p>
                              <p className="text-xs font-semibold text-gray-700 mt-1">ANEXO V — FORMULÁRIO PARA RECURSO</p>
                            </div>

                            <div className="px-4 py-3 space-y-3">
                              {/* Destinatário */}
                              <div className="text-xs text-gray-600 space-y-0.5">
                                <p>À Secretária Municipal de Educação de Oriximiná</p>
                                <p>Sra. Secretária,</p>
                              </div>

                              <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">Interposição de Recursos</p>

                              {/* Dados do candidato — leitura */}
                              <div className="bg-white rounded-lg border border-orange-100 px-3 py-2.5 space-y-1.5">
                                <div className="grid grid-cols-1 gap-1 text-xs text-gray-700">
                                  <p><span className="text-gray-400">Nome completo (sem abreviatura):</span> <span className="font-semibold">{candidato.nome}</span></p>
                                  <p><span className="text-gray-400">RG:</span> <span className="font-semibold">{candidato.rg ?? '—'}</span></p>
                                  <p><span className="text-gray-400">CPF:</span> <span className="font-semibold">{candidato.cpf}</span></p>
                                  <p>
                                    <span className="text-gray-400">Data de Nascimento:</span>{' '}
                                    <span className="font-semibold">
                                      {candidato.dataNasc
                                        ? new Date(candidato.dataNasc).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                                        : '—'}
                                    </span>
                                  </p>
                                  <p><span className="text-gray-400">Telefone / E-mail:</span> <span className="font-semibold">{candidato.telefone} / {candidato.email}</span></p>
                                </div>
                              </div>

                              {/* Justificativa */}
                              <div className="space-y-1">
                                <p className="text-xs text-gray-600">
                                  Solicito revisão sob os seguintes argumentos:
                                </p>
                                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Fundamentação / Justificativa:</p>
                                <textarea
                                  rows={6}
                                  value={recursoTexto}
                                  onChange={e => setRecursoTexto(e.target.value)}
                                  placeholder="Descreva detalhadamente os motivos do seu recurso..."
                                  className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
                                />
                              </div>

                              {/* Rodapé do documento */}
                              <p className="text-xs text-gray-500 text-right">
                                Oriximiná — Pará,{' '}
                                {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}.
                              </p>
                              <div className="border-t border-orange-200 pt-2 text-center">
                                <p className="text-xs text-gray-400">Assinatura digital do(a) candidato(a)</p>
                                <p className="text-xs font-semibold text-gray-700">{candidato.nome}</p>
                              </div>

                              {/* Botões */}
                              <div className="flex gap-2 pt-1">
                                <button
                                  onClick={() => { setRecursoAberto(null); setRecursoTexto(''); }}
                                  className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-50 transition-colors"
                                >
                                  Cancelar
                                </button>
                                <button
                                  onClick={() => etapa.id && handleRecurso(etapa.id)}
                                  disabled={recursoSaving || !recursoTexto.trim() || !etapa.id}
                                  className="flex-1 py-2 rounded-lg text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 transition-colors"
                                >
                                  {recursoSaving ? 'Enviando…' : 'Enviar Recurso'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </main>

      <Footer />
    </div>
  );
}
