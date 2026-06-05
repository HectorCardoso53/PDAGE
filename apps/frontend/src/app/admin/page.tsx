'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LogOut, CheckCircle, Clock, XCircle,
  FileText, Brain, GraduationCap, ClipboardList, BarChart, Award, X, UserCheck, Lock, RefreshCw,
} from 'lucide-react';
import { apiFetch, API_BASE } from '@/lib/api';

function parseJwt(token: string): { role: string; nome: string; sub: string } | null {
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
}

const DOC_FIELDS: { field: keyof AdminCandidato; label: string }[] = [
  { field: 'docRg',            label: 'RG ou CNH' },
  { field: 'docCpf',           label: 'CPF' },
  { field: 'docResidencia',    label: 'Comprovante de Residência' },
  { field: 'docTituloEleitor', label: 'Título de Eleitor' },
  { field: 'docQuitacao',      label: 'Quitação Eleitoral' },
  { field: 'docReservista',    label: 'Carteira de Reservista' },
  { field: 'docDiploma',       label: 'Diploma' },
  { field: 'docPosGraduacao',  label: 'Certificado de Pós-grad.' },
  { field: 'docLotacao',       label: 'Comprovante de Lotação' },
];

type StatusEtapa = 'PENDENTE' | 'EM_ANALISE' | 'APROVADO' | 'REPROVADO';

type EtapaAdmin = {
  id: string | null;
  etapa: string;
  label: string;
  status: StatusEtapa;
  pontuacao: number | null;
  observacao: string | null;
  recurso: string | null;
  docChecks: string | null;
};

type AdminCandidato = {
  id: string;
  nome: string;
  cpf: string;
  dataNasc: string | null;
  rg: string | null;
  orgaoEmissor: string | null;
  sexo: string | null;
  estadoCivil: string | null;
  email: string;
  telefone: string;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  bairro: string | null;
  cidade: string | null;
  vinculo: string | null;
  cargo: string;
  escola: string;
  matricula: string | null;
  municipio: string;
  tempoServico: string | null;
  formacao: string | null;
  especializacao: string | null;
  createdAt: string;
  updatedAt: string;
  docRg: string | null;
  docCpf: string | null;
  docResidencia: string | null;
  docTituloEleitor: string | null;
  docQuitacao: string | null;
  docReservista: string | null;
  docDiploma: string | null;
  docPosGraduacao: string | null;
  docLotacao: string | null;
  inscricao: { id: string; protocolo: string; createdAt: string } | null;
  etapas: EtapaAdmin[];
};

const STATUS_CONFIG: Record<StatusEtapa, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  PENDENTE:   { label: 'Pendente',    color: 'text-gray-500',  bg: 'bg-gray-100',  border: 'border-gray-200',  icon: Clock },
  EM_ANALISE: { label: 'Em análise',  color: 'text-amber-600', bg: 'bg-amber-50',  border: 'border-amber-200', icon: Clock },
  APROVADO:   { label: 'Habilitado',  color: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-200', icon: CheckCircle },
  REPROVADO:  { label: 'Inabilitado', color: 'text-red-600',   bg: 'bg-red-50',    border: 'border-red-200',   icon: XCircle },
};

function getStatusCfg(status: StatusEtapa, etapaTipo: string) {
  const base = STATUS_CONFIG[status];
  if (etapaTipo === 'INSCRICAO' && status === 'APROVADO')
    return { ...base, label: 'Inscrito' };
  return base;
}

const STATUS_OPTIONS: { value: StatusEtapa; label: string; color: string; bg: string; border: string }[] = [
  { value: 'EM_ANALISE', label: 'Em análise',  color: 'text-amber-700', bg: 'bg-amber-50',  border: 'border-amber-400' },
  { value: 'APROVADO',   label: 'Habilitado',  color: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-500' },
  { value: 'REPROVADO',  label: 'Inabilitado', color: 'text-red-700',   bg: 'bg-red-50',    border: 'border-red-500' },
];

const ETAPA_ICONS: Record<string, React.ElementType> = {
  INSCRICAO: UserCheck,
  HABILITACAO_DOCUMENTAL: FileText,
  AVALIACAO_COGNITIVA: Brain,
  QUALIFICACAO_CURRICULAR: GraduationCap,
  PLANO_GESTAO: ClipboardList,
  RESULTADO_FINAL: BarChart,
  CERTIFICACAO: Award,
};

const ETAPA_NOTES: Record<string, string> = {
  INSCRICAO: 'Valide os dados cadastrais do candidato e habilite ou inabilite a inscrição no processo seletivo.',
  HABILITACAO_DOCUMENTAL: 'Verifique os documentos enviados e confira se os dados abaixo correspondem ao cadastro.',
  AVALIACAO_COGNITIVA: 'Insira a pontuação obtida pelo candidato na avaliação cognitiva realizada externamente.',
  QUALIFICACAO_CURRICULAR: 'Avalie a formação acadêmica e o tempo de serviço do candidato.',
  PLANO_GESTAO: 'Analise o plano de gestão submetido pelo candidato e registre o resultado.',
  RESULTADO_FINAL: 'Defina o resultado final com base no desempenho em todas as etapas anteriores.',
  CERTIFICACAO: 'Emita a certificação para o candidato aprovado no processo seletivo.',
};

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR');
}

function fmtTel(t: string) {
  const n = t.replace(/\D/g, '');
  if (n.length === 11) return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`;
  if (n.length === 10) return `(${n.slice(0,2)}) ${n.slice(2,6)}-${n.slice(6)}`;
  return t;
}

function fmtCpf(cpf: string) {
  const n = cpf.replace(/\D/g, '');
  return n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

type InfoRow = { label: string; value: string };

function getStageData(etapa: string, c: AdminCandidato, allEtapas: EtapaAdmin[]): InfoRow[] {
  const endereco = [c.logradouro, c.numero, c.bairro, c.cidade].filter(Boolean).join(', ') || '—';

  switch (etapa) {
    case 'INSCRICAO':
      return [
        { label: 'Nome completo', value: c.nome },
        { label: 'CPF',           value: fmtCpf(c.cpf) },
        { label: 'E-mail',        value: c.email },
        { label: 'Telefone',      value: fmtTel(c.telefone) },
        { label: 'Vínculo',       value: c.vinculo || '—' },
        { label: 'Cargo',         value: c.cargo },
        { label: 'Escola',        value: c.escola },
        { label: 'Matrícula',     value: c.matricula || '—' },
        { label: 'Município',     value: c.municipio },
        { label: 'Inscrição em',  value: c.inscricao ? fmtDate(c.inscricao.createdAt) : '—' },
      ];
    case 'HABILITACAO_DOCUMENTAL':
      return [
        { label: 'Nome completo',  value: c.nome },
        { label: 'CPF',            value: fmtCpf(c.cpf) },
        { label: 'RG',             value: c.rg || '—' },
        { label: 'Órgão emissor',  value: c.orgaoEmissor || '—' },
        { label: 'Data de nasc.',  value: fmtDate(c.dataNasc) },
        { label: 'Sexo',           value: c.sexo || '—' },
        { label: 'Estado civil',   value: c.estadoCivil || '—' },
        { label: 'Telefone',       value: fmtTel(c.telefone) },
        { label: 'E-mail',         value: c.email },
        { label: 'Endereço',       value: endereco },
        { label: 'CEP',            value: c.cep || '—' },
        { label: 'Vínculo',        value: c.vinculo || '—' },
        { label: 'Cargo',          value: c.cargo },
        { label: 'Escola',         value: c.escola },
        ...(c.vinculo !== 'Temporário' ? [{ label: 'Matrícula', value: c.matricula || '—' }] : []),
        { label: 'Município',      value: c.municipio },
        { label: 'Formação',       value: c.formacao || '—' },
        { label: 'Especialização', value: c.especializacao || '—' },
        { label: 'Tempo de serv.', value: c.tempoServico || '—' },
      ];
    case 'QUALIFICACAO_CURRICULAR':
      return [
        { label: 'Formação',       value: c.formacao || '—' },
        { label: 'Especialização', value: c.especializacao || '—' },
        { label: 'Tempo de serv.', value: c.tempoServico || '—' },
        { label: 'Cargo',          value: c.cargo },
        { label: 'Escola',         value: c.escola },
        { label: 'Município',      value: c.municipio },
      ];
    case 'AVALIACAO_COGNITIVA':
      return [
        { label: 'Candidato',  value: c.nome },
        { label: 'Vínculo',    value: c.vinculo || '—' },
        { label: 'Cargo',      value: c.cargo },
        { label: 'Escola',     value: c.escola },
        { label: 'Matrícula',  value: c.matricula || '—' },
      ];
    case 'PLANO_GESTAO':
      return [
        { label: 'Candidato', value: c.nome },
        { label: 'Cargo',     value: c.cargo },
        { label: 'Escola',    value: c.escola },
        { label: 'Município', value: c.municipio },
      ];
    case 'RESULTADO_FINAL':
    case 'CERTIFICACAO':
      return allEtapas
        .filter(e => e.etapa !== 'RESULTADO_FINAL' && e.etapa !== 'CERTIFICACAO')
        .map(e => ({
          label: e.label,
          value: getStatusCfg(e.status, e.etapa).label + (e.pontuacao !== null ? ` — ${e.pontuacao} pts` : ''),
        }));
    default:
      return [];
  }
}

export default function AdminPage() {
  const router = useRouter();
  const [candidatos, setCandidatos] = useState<AdminCandidato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selected, setSelected] = useState<AdminCandidato | null>(null);
  const [editingEtapa, setEditingEtapa] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ status: StatusEtapa; pontuacao: string; observacao: string }>({
    status: 'PENDENTE', pontuacao: '', observacao: '',
  });
  const [saving, setSaving] = useState(false);
  const activeTab = 'revisao' as const;
  const [reviewing, setReviewing] = useState<AdminCandidato | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [reviewSaving, setReviewSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [docChecks, setDocChecks] = useState<Record<string, boolean | null>>({});
  const [currentUser, setCurrentUser] = useState<{ role: string; nome: string; permissao?: string } | null>(null);
  const [showAuditoria, setShowAuditoria] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [showMembros, setShowMembros] = useState(false);
  const [membros, setMembros] = useState<any[]>([]);
  const [showNovoMembro, setShowNovoMembro] = useState(false);
  const [novoMembroForm, setNovoMembroForm] = useState({ nome: '', cpf: '', email: '', senha: '', permissao: 'AVALIADOR' });
  const [novoMembroError, setNovoMembroError] = useState('');
  const [novoMembroSaving, setNovoMembroSaving] = useState(false);
  const [resetSenhaId, setResetSenhaId] = useState<string | null>(null);
  const [novaSenha, setNovaSenha] = useState('');
  const [pendingPage, setPendingPage] = useState(1);
  const [revisadosPage, setRevisadosPage] = useState(1);
  const [locks, setLocks] = useState<Record<string, string>>({});
  const lockHeartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const applyDocCheck = (fieldKey: string, newVal: boolean | null, candidato: AdminCandidato) => {
    setDocChecks(prev => {
      const next = { ...prev, [fieldKey]: newVal };
      const habEtapa = candidato.etapas.find(e => e.etapa === 'HABILITACAO_DOCUMENTAL');
      if (habEtapa?.id) {
        const filtered = Object.fromEntries(Object.entries(next).filter(([, v]) => v !== null));
        const t = localStorage.getItem('meritus_admin_token');
        apiFetch(`/api/admin/etapa/${habEtapa.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
          body: JSON.stringify({ status: habEtapa.status, docChecks: JSON.stringify(filtered) }),
        }).then(() => {
          setCandidatos(prev2 => prev2.map(c => c.id !== candidato.id ? c : {
            ...c,
            etapas: c.etapas.map(e => e.etapa === 'HABILITACAO_DOCUMENTAL'
              ? { ...e, docChecks: JSON.stringify(filtered) }
              : e),
          }));
        }).catch(() => {});
      }
      return next;
    });
  };

  const fetchLocks = useCallback(async () => {
    const t = localStorage.getItem('meritus_admin_token');
    if (!t) return;
    try {
      const res = await apiFetch('/api/admin/locks', { headers: { Authorization: `Bearer ${t}` } });
      if (res.ok) setLocks(await res.json());
    } catch { /* silencioso */ }
  }, []);

  const load = useCallback(async () => {
    const t = localStorage.getItem('meritus_admin_token');
    if (!t) { router.replace('/admin/login'); return; }
    const user = parseJwt(t);
    setCurrentUser(user);
    try {
      const res = await apiFetch('/api/admin/candidatos', {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.status === 401 || res.status === 403) { router.replace('/admin/login'); return; }
      const data = await res.json();
      setCandidatos(Array.isArray(data) ? data : []);
    } catch {
      setError('Erro ao carregar candidatos.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const loadAuditLogs = useCallback(async () => {
    const t = localStorage.getItem('meritus_admin_token');
    if (!t) return;
    try {
      const res = await apiFetch('/api/admin/audit-logs', { headers: { Authorization: `Bearer ${t}` } });
      if (res.ok) setAuditLogs(await res.json());
    } catch { /* silencioso */ }
  }, []);

  const loadMembros = useCallback(async () => {
    const t = localStorage.getItem('meritus_admin_token');
    if (!t) return;
    try {
      const res = await apiFetch('/api/admin/membros', { headers: { Authorization: `Bearer ${t}` } });
      if (res.ok) setMembros(await res.json());
    } catch { /* silencioso */ }
  }, []);

  useEffect(() => {
    load();
    fetchLocks();
    const interval = setInterval(fetchLocks, 20_000);
    return () => clearInterval(interval);
  }, [load, fetchLocks]);

  const openReview = useCallback(async (c: AdminCandidato, force = false) => {
    const t = localStorage.getItem('meritus_admin_token');
    if (!t) return;
    if (!force) {
      try {
        const res = await apiFetch(`/api/admin/candidato/${c.id}/lock`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${t}` },
        });
        const data = await res.json();
        if (!data.ok) {
          if (!confirm(`${data.lockedBy} está analisando este candidato agora.\n\nDeseja abrir mesmo assim?`)) return;
          // force-override: acquire again
          await apiFetch(`/api/admin/candidato/${c.id}/lock`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${t}` },
          });
        }
      } catch { /* ignora */ }
    }
    setReviewing(c);
    setReviewAction(null);
    setRejectReason('');
    const hab = c.etapas.find(e => e.etapa === 'HABILITACAO_DOCUMENTAL');
    setDocChecks(hab?.docChecks ? JSON.parse(hab.docChecks) : {});
    setLocks(prev => {
      const next = { ...prev };
      delete next[c.id];
      return next;
    });
    if (lockHeartbeatRef.current) clearInterval(lockHeartbeatRef.current);
    lockHeartbeatRef.current = setInterval(async () => {
      const tk = localStorage.getItem('meritus_admin_token');
      if (!tk) return;
      await apiFetch(`/api/admin/candidato/${c.id}/lock`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${tk}` },
      });
    }, 3 * 60 * 1000);
  }, []);

  const closeReview = useCallback(async (candidatoId?: string) => {
    if (lockHeartbeatRef.current) { clearInterval(lockHeartbeatRef.current); lockHeartbeatRef.current = null; }
    if (candidatoId) {
      const t = localStorage.getItem('meritus_admin_token');
      if (t) {
        apiFetch(`/api/admin/candidato/${candidatoId}/lock`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${t}` },
        }).catch(() => {});
      }
    }
    setReviewing(null);
    setReviewAction(null);
    setRejectReason('');
    fetchLocks();
  }, [fetchLocks]);

  const handleLogout = () => {
    localStorage.removeItem('meritus_admin_token');
    router.replace('/admin/login');
  };

  const startEdit = (etapa: EtapaAdmin) => {
    setEditingEtapa(etapa.etapa);
    setEditForm({
      status: etapa.status,
      pontuacao: etapa.pontuacao !== null ? String(etapa.pontuacao) : '',
      observacao: etapa.observacao ?? '',
    });
    setDocChecks(etapa.docChecks ? JSON.parse(etapa.docChecks) : {});
  };

  const handleSave = async (etapa: EtapaAdmin) => {
    if (!etapa.id || !selected) return;
    setSaving(true);

    let finalObservacao = editForm.observacao;
    if (etapa.etapa === 'HABILITACAO_DOCUMENTAL') {
      const rejected = DOC_FIELDS
        .filter(({ field }) => docChecks[field] === false && !!selected[field])
        .map(({ label }) => label);
      if (rejected.length > 0) {
        const prefix = `Docs com problema: ${rejected.join(', ')}`;
        finalObservacao = editForm.observacao ? `${prefix}. ${editForm.observacao}` : prefix;
      }
    }

    const isHabilitacao = etapa.etapa === 'HABILITACAO_DOCUMENTAL';
    const docChecksJson = isHabilitacao && Object.keys(docChecks).length > 0
      ? JSON.stringify(docChecks)
      : undefined;

    const t = localStorage.getItem('meritus_admin_token');
    try {
      const res = await apiFetch(`/api/admin/etapa/${etapa.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify({
          status: editForm.status,
          pontuacao: editForm.pontuacao !== '' ? Number(editForm.pontuacao) : undefined,
          observacao: finalObservacao || undefined,
          ...(docChecksJson ? { docChecks: docChecksJson } : {}),
        }),
      });
      if (!res.ok) return;

      const updated: EtapaAdmin = {
        ...etapa,
        status: editForm.status,
        pontuacao: editForm.pontuacao !== '' ? Number(editForm.pontuacao) : null,
        observacao: editForm.observacao || null,
        docChecks: docChecksJson ?? etapa.docChecks,
      };

      setCandidatos(prev => prev.map(c => c.id !== selected.id ? c : {
        ...c, etapas: c.etapas.map(e => e.etapa === etapa.etapa ? updated : e),
      }));
      setSelected(prev => prev ? {
        ...prev, etapas: prev.etapas.map(e => e.etapa === etapa.etapa ? updated : e),
      } : null);
      setEditingEtapa(null);
    } finally {
      setSaving(false);
    }
  };

  const handleReview = async (candidato: AdminCandidato, action: 'approve' | 'reject', reason?: string) => {
    const etapa = candidato.etapas.find(e => e.etapa === 'INSCRICAO');
    if (!etapa?.id) return;
    setReviewSaving(true);
    const t = localStorage.getItem('meritus_admin_token');
    try {
      const res = await apiFetch(`/api/admin/etapa/${etapa.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify({
          status: action === 'approve' ? 'APROVADO' : 'REPROVADO',
          observacao: action === 'reject' ? reason : undefined,
        }),
      });
      if (!res.ok) return;

      // Atualizar HABILITACAO_DOCUMENTAL junto com a decisão da inscrição
      const habEtapa = candidato.etapas.find(e => e.etapa === 'HABILITACAO_DOCUMENTAL');
      const checksJson = Object.keys(docChecks).length > 0 ? JSON.stringify(docChecks) : null;
      const habNovoStatus = action === 'approve' ? 'APROVADO' : 'REPROVADO';
      if (habEtapa?.id) {
        await apiFetch(`/api/admin/etapa/${habEtapa.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
          body: JSON.stringify({
            status: habNovoStatus,
            ...(checksJson ? { docChecks: checksJson } : {}),
          }),
        });
      }

      const newStatus = action === 'approve' ? 'APROVADO' : 'REPROVADO';
      setCandidatos(prev => prev.map(c => c.id !== candidato.id ? c : {
        ...c,
        etapas: c.etapas.map(e => {
          if (e.etapa === 'INSCRICAO')
            return { ...e, status: newStatus, observacao: action === 'reject' ? (reason ?? null) : null };
          if (e.etapa === 'HABILITACAO_DOCUMENTAL')
            return { ...e, status: habNovoStatus, ...(checksJson ? { docChecks: checksJson } : {}) };
          return e;
        }),
      }));
      closeReview(candidato.id);
    } finally {
      setReviewSaving(false);
    }
  };

  const handleDelete = async (candidato: AdminCandidato) => {
    if (!confirm(`Excluir o candidato "${candidato.nome}" permanentemente? Esta ação não pode ser desfeita.`)) return;
    setDeleting(true);
    const t = localStorage.getItem('meritus_admin_token');
    try {
      const res = await apiFetch(`/api/admin/candidato/${candidato.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) return;
      setCandidatos(prev => prev.filter(c => c.id !== candidato.id));
      setReviewing(null);
    } finally {
      setDeleting(false);
    }
  };

  const maskCpf = (v: string) =>
    v.replace(/\D/g, '').slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  const handleCreateMembro = async () => {
    setNovoMembroError('');
    if (!novoMembroForm.nome || !novoMembroForm.cpf || !novoMembroForm.email || !novoMembroForm.senha) {
      setNovoMembroError('Preencha todos os campos.'); return;
    }
    setNovoMembroSaving(true);
    const t = localStorage.getItem('meritus_admin_token');
    try {
      const res = await apiFetch('/api/admin/membros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify(novoMembroForm),
      });
      const data = await res.json();
      if (!res.ok) { setNovoMembroError(data.message ?? 'Erro ao criar membro.'); return; }
      setMembros(prev => [...prev, data]);
      setShowNovoMembro(false);
      setNovoMembroForm({ nome: '', cpf: '', email: '', senha: '', permissao: 'AVALIADOR' });
    } catch { setNovoMembroError('Erro de conexão.'); }
    finally { setNovoMembroSaving(false); }
  };

  const handleToggleMembro = async (id: string) => {
    const t = localStorage.getItem('meritus_admin_token');
    try {
      const res = await apiFetch(`/api/admin/membros/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) { const updated = await res.json(); setMembros(prev => prev.map(m => m.id === id ? updated : m)); }
    } catch {}
  };

  const handleDeleteMembro = async (id: string, nome: string) => {
    if (!confirm(`Excluir o membro "${nome}" permanentemente?`)) return;
    const t = localStorage.getItem('meritus_admin_token');
    try {
      const res = await apiFetch(`/api/admin/membros/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) setMembros(prev => prev.filter(m => m.id !== id));
    } catch {}
  };

  const handleResetSenha = async (id: string) => {
    if (!novaSenha || novaSenha.length < 6) { alert('A nova senha deve ter pelo menos 6 caracteres.'); return; }
    const t = localStorage.getItem('meritus_admin_token');
    try {
      const res = await apiFetch(`/api/admin/membros/${id}/senha`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify({ novaSenha }),
      });
      if (res.ok) { setResetSenhaId(null); setNovaSenha(''); alert('Senha redefinida com sucesso.'); }
    } catch {}
  };

  const handleUpdatePermissao = async (id: string, permissao: string) => {
    const t = localStorage.getItem('meritus_admin_token');
    try {
      const res = await apiFetch(`/api/admin/membros/${id}/permissao`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify({ permissao }),
      });
      if (res.ok) { const updated = await res.json(); setMembros(prev => prev.map(m => m.id === id ? updated : m)); }
    } catch {}
  };

  const PAGE_SIZE = 20;

  const pendingRevisao = candidatos.filter(c =>
    ['PENDENTE', 'EM_ANALISE'].includes(c.etapas.find(e => e.etapa === 'INSCRICAO')?.status ?? '')
  );
  const revisados = candidatos.filter(c =>
    ['APROVADO', 'REPROVADO'].includes(c.etapas.find(e => e.etapa === 'INSCRICAO')?.status ?? '')
  );

  const pendingTotalPages = Math.max(1, Math.ceil(pendingRevisao.length / PAGE_SIZE));
  const pendingSlice = pendingRevisao.slice((pendingPage - 1) * PAGE_SIZE, pendingPage * PAGE_SIZE);

  const revisadosTotalPages = Math.max(1, Math.ceil(revisados.length / PAGE_SIZE));
  const revisadosSlice = revisados.slice((revisadosPage - 1) * PAGE_SIZE, revisadosPage * PAGE_SIZE);

  const handlePrintReport = () => {
    const habilitados = candidatos
      .filter(c => c.etapas.find(e => e.etapa === 'HABILITACAO_DOCUMENTAL')?.status === 'APROVADO')
      .sort((a, b) => {
        const dA = a.inscricao?.createdAt ?? a.createdAt;
        const dB = b.inscricao?.createdAt ?? b.createdAt;
        return new Date(dA).getTime() - new Date(dB).getTime();
      });

    const dataImpressao = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    const logoUrl = `${window.location.origin}/logo.png`;

    const rows = habilitados.map((c, idx) => `
      <tr style="${idx % 2 === 1 ? 'background:#f8fafc' : ''}">
        <td style="padding:7px 10px;text-align:center;font-weight:700;color:#001b3d;border-bottom:1px solid #e5e7eb">${idx + 1}º</td>
        <td style="padding:7px 10px;font-weight:600;color:#111827;border-bottom:1px solid #e5e7eb">${c.nome}</td>
        <td style="padding:7px 10px;font-family:monospace;font-size:11px;color:#4b5563;border-bottom:1px solid #e5e7eb">${fmtCpf(c.cpf)}</td>
        <td style="padding:7px 10px;color:#374151;border-bottom:1px solid #e5e7eb">${c.inscricao?.protocolo ?? '—'}</td>
        <td style="padding:7px 10px;color:#374151;border-bottom:1px solid #e5e7eb">${c.cargo}</td>
        <td style="padding:7px 10px;color:#374151;border-bottom:1px solid #e5e7eb">${c.escola}</td>
        <td style="padding:7px 10px;color:#374151;border-bottom:1px solid #e5e7eb">${c.municipio}</td>
        <td style="padding:7px 10px;text-align:center;border-bottom:1px solid #e5e7eb">
          <span style="display:inline-block;padding:2px 10px;border-radius:20px;background:#dcfce7;color:#15803d;font-weight:700;font-size:11px">HOMOLOGADO</span>
        </td>
      </tr>`).join('');

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <title>Homologação de Inscrições — Meritus</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 12px; color: #111827; background: #fff; padding: 0; }
    @page { size: A4 portrait; margin: 18mm 15mm; }
    .topo { display: flex; align-items: center; justify-content: center; gap: 18px; padding-bottom: 14px; border-bottom: 3px solid #001b3d; margin-bottom: 18px; }
    .topo img { width: 64px; height: 64px; object-fit: contain; }
    .topo-texto { text-align: center; }
    .topo-texto .prefeitura { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
    .topo-texto .titulo { font-size: 18px; font-weight: 800; color: #001b3d; line-height: 1.1; margin: 3px 0; }
    .topo-texto .subtitulo { font-size: 11px; color: #374151; }
    .secao-titulo { text-align: center; margin-bottom: 14px; }
    .secao-titulo h2 { font-size: 13px; font-weight: 800; color: #001b3d; text-transform: uppercase; letter-spacing: 0.08em; border: 2px solid #001b3d; display: inline-block; padding: 4px 18px; }
    .secao-titulo p { font-size: 11px; color: #6b7280; margin-top: 6px; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #001b3d; }
    thead th { padding: 8px 10px; text-align: left; font-size: 11px; font-weight: 700; color: #fff; white-space: nowrap; }
    thead th:first-child, thead th:last-child { text-align: center; }
    tbody td { font-size: 11.5px; vertical-align: middle; }
    .rodape { margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 14px; }
    .rodape-assinatura { display: flex; justify-content: center; margin-top: 32px; }
    .assinatura-bloco { text-align: center; width: 260px; }
    .assinatura-bloco .linha { border-top: 1px solid #374151; padding-top: 6px; font-size: 11px; color: #374151; font-weight: 600; }
    .assinatura-bloco .cargo { font-size: 10px; color: #6b7280; }
    .rodape-info { text-align: center; font-size: 10px; color: #9ca3af; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="topo">
    <img src="${logoUrl}" alt="Logo Prefeitura" onerror="this.style.display='none'"/>
    <div class="topo-texto">
      <div class="prefeitura">Prefeitura Municipal de Oriximiná</div>
      <div class="titulo">Meritus</div>
      <div class="subtitulo">Processo Seletivo para Gestor Escolar · 2026</div>
    </div>
  </div>

  <div class="secao-titulo">
    <h2>Homologação de Inscrições</h2>
    <p>Relação de candidatos com inscrição homologada · Total: <strong>${habilitados.length}</strong> candidato(s)</p>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:30px">Nº</th>
        <th>Nome Completo</th>
        <th>CPF</th>
        <th>Protocolo</th>
        <th>Cargo</th>
        <th>Escola</th>
        <th>Município</th>
        <th style="text-align:center">Situação</th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="8" style="text-align:center;padding:20px;color:#9ca3af">Nenhuma inscrição homologada.</td></tr>'}
    </tbody>
  </table>

  <div class="rodape">
    <div class="rodape-assinatura">
      <div class="assinatura-bloco">
        <div class="linha">Secretaria Municipal de Educação</div>
        <div class="cargo">Oriximiná, ${dataImpressao}</div>
      </div>
    </div>
    <div class="rodape-info">Documento gerado pelo sistema Meritus · ${new Date().toLocaleString('pt-BR')}</div>
  </div>

  <script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`;

    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
  };


  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f4f6f8' }}>
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Carregando painel...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#f4f6f8' }}>
      <div className="text-center max-w-sm">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => { setError(''); setLoading(true); load(); }}
          className="px-4 py-2 rounded-lg text-white text-sm" style={{ background: '#001b3d' }}>
          Tentar novamente
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4f6f8' }}>

      {/* Header */}
      <header className="sticky top-0 z-40" style={{ background: '#001b3d', borderBottom: '3px solid #ffd21f' }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Meritus" width={32} height={32} className="object-contain" />
            <span className="font-bold text-white text-lg">Meritus</span>
            <span className="hidden sm:inline text-xs text-white/50 ml-1">— Painel Administrativo</span>
          </div>
          <div className="flex items-center gap-2">
            {currentUser && (
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs text-white/70 max-w-[200px] truncate">{currentUser.nome}</span>
                {currentUser.permissao === 'MASTER' && (
                  <span className="text-[10px] text-amber-300 font-semibold">Master</span>
                )}
                {currentUser.permissao === 'AVALIADOR' && (
                  <span className="text-[10px] text-blue-300 font-semibold">Avaliador</span>
                )}
              </div>
            )}
            <button onClick={handlePrintReport}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              Relatório
            </button>
            {(currentUser?.role === 'admin' || (currentUser?.role === 'comissao' && currentUser?.permissao === 'MASTER')) && (
              <>
                <button onClick={() => { setShowMembros(true); loadMembros(); }}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                  Comissão
                </button>
                <button onClick={() => { setShowAuditoria(true); loadAuditLogs(); }}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                  Auditoria
                </button>
              </>
            )}
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* Modal — Membros da Comissão */}
      {showMembros && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold" style={{ color: '#001b3d' }}>Gestão de Usuários</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setShowNovoMembro(v => !v); setNovoMembroError(''); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                  style={{ background: '#001b3d' }}>
                  {showNovoMembro ? 'Cancelar' : '+ Novo usuário'}
                </button>
                <button onClick={() => { setShowMembros(false); setShowNovoMembro(false); }} className="text-gray-400 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Formulário novo membro */}
            {showNovoMembro && (
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Novo usuário da comissão</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Nome completo *</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                      placeholder="Nome completo"
                      value={novoMembroForm.nome}
                      onChange={e => setNovoMembroForm(f => ({ ...f, nome: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">CPF (será o login) *</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                      placeholder="000.000.000-00"
                      value={novoMembroForm.cpf}
                      onChange={e => setNovoMembroForm(f => ({ ...f, cpf: maskCpf(e.target.value) }))}
                      maxLength={14}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">E-mail *</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                      placeholder="email@exemplo.com"
                      value={novoMembroForm.email}
                      onChange={e => setNovoMembroForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Senha inicial *</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                      placeholder="Mínimo 6 caracteres"
                      value={novoMembroForm.senha}
                      onChange={e => setNovoMembroForm(f => ({ ...f, senha: e.target.value }))}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Permissão *</label>
                    <div className="flex gap-3">
                      {[
                        { val: 'AVALIADOR', label: 'Avaliador', desc: 'Pode avaliar inscrições e editar etapas dos candidatos' },
                        { val: 'MASTER',    label: 'Master',    desc: 'Avaliador + acesso à Auditoria e Gestão de Usuários' },
                      ].map(opt => (
                        <label key={opt.val} className={`flex-1 flex items-start gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${novoMembroForm.permissao === opt.val ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-200'}`}>
                          <input type="radio" name="novaPermissao" className="mt-0.5 accent-blue-500" checked={novoMembroForm.permissao === opt.val} onChange={() => setNovoMembroForm(f => ({ ...f, permissao: opt.val }))} />
                          <div>
                            <p className="text-sm font-semibold text-gray-700">{opt.label}</p>
                            <p className="text-xs text-gray-400">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                {novoMembroError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{novoMembroError}</p>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={handleCreateMembro}
                    disabled={novoMembroSaving}
                    className="px-5 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-60"
                    style={{ background: '#001b3d' }}>
                    {novoMembroSaving ? 'Criando...' : 'Criar usuário'}
                  </button>
                </div>
              </div>
            )}

            {/* Tabela de membros */}
            <div className="p-6 space-y-2">
              {membros.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">Carregando...</p>
              ) : (
                <div className="space-y-2">
                  {membros.map((m: any) => (
                    <div key={m.id} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm">{m.nome}</p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">CPF: {m.cpf}</p>
                          <p className="text-xs text-gray-400 truncate">{m.email}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                          {/* Seletor de permissão */}
                          <select
                            value={m.permissao ?? 'AVALIADOR'}
                            onChange={e => handleUpdatePermissao(m.id, e.target.value)}
                            className={`text-xs font-semibold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                              m.permissao === 'MASTER'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                            title="Alterar permissão">
                            <option value="AVALIADOR">Avaliador</option>
                            <option value="MASTER">Master</option>
                          </select>
                          {/* Toggle ativo/inativo */}
                          <button
                            onClick={() => handleToggleMembro(m.id)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                              m.ativo
                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                                : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
                            }`}
                            title={m.ativo ? 'Clique para desativar' : 'Clique para ativar'}>
                            {m.ativo ? 'Ativo' : 'Inativo'}
                          </button>
                          {/* Reset senha */}
                          <button
                            onClick={() => { setResetSenhaId(resetSenhaId === m.id ? null : m.id); setNovaSenha(''); }}
                            className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                            title="Redefinir senha">
                            🔑
                          </button>
                          {/* Excluir */}
                          <button
                            onClick={() => handleDeleteMembro(m.id, m.nome)}
                            className="text-xs px-2.5 py-1 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Excluir usuário">
                            🗑
                          </button>
                        </div>
                      </div>

                      {/* Inline reset senha */}
                      {resetSenhaId === m.id && (
                        <div className="mt-3 flex gap-2 items-center border-t border-gray-100 pt-3">
                          <input
                            type="password"
                            className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                            placeholder="Nova senha (mín. 6 caracteres)"
                            value={novaSenha}
                            onChange={e => setNovaSenha(e.target.value)}
                          />
                          <button
                            onClick={() => handleResetSenha(m.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                            style={{ background: '#001b3d' }}>
                            Salvar
                          </button>
                          <button
                            onClick={() => { setResetSenhaId(null); setNovaSenha(''); }}
                            className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-500 hover:bg-gray-100">
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal — Auditoria */}
      {showAuditoria && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold" style={{ color: '#001b3d' }}>Auditoria de Ações</h3>
              <button onClick={() => setShowAuditoria(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {auditLogs.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Nenhuma ação registrada ainda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-400 uppercase text-left border-b border-gray-100">
                        <th className="pb-2 font-semibold">Data/Hora</th>
                        <th className="pb-2 font-semibold">Autor</th>
                        <th className="pb-2 font-semibold">Ação</th>
                        <th className="pb-2 font-semibold">Candidato</th>
                        <th className="pb-2 font-semibold">Antes → Depois</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {auditLogs.map((log: any) => {
                        const antes = log.dadosAntes ? JSON.parse(log.dadosAntes) : null;
                        const depois = log.dadosDepois ? JSON.parse(log.dadosDepois) : null;
                        const dt = new Date(log.createdAt);
                        const data = dt.toLocaleDateString('pt-BR');
                        const hora = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                        return (
                          <tr key={log.id} className="text-gray-700 align-top">
                            <td className="py-2.5 text-xs text-gray-500 whitespace-nowrap">{data}<br />{hora}</td>
                            <td className="py-2.5 font-medium text-xs max-w-[140px]">{log.autorNome}<br /><span className="text-gray-400 font-normal">{log.autorRole === 'admin' ? 'Administrador' : 'Comissão'}</span></td>
                            <td className="py-2.5 text-xs max-w-[160px]">{log.acao}</td>
                            <td className="py-2.5 text-xs text-gray-600 max-w-[150px]">{log.candidatoNome ?? '—'}</td>
                            <td className="py-2.5 text-xs text-gray-500">
                              {antes && depois ? (
                                <span>{antes.status} → <strong className="text-gray-700">{depois.status}</strong></span>
                              ) : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* Tab navigation — aba Candidatos oculta por enquanto */}
        {/* <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1 w-fit">
          {([
            { key: 'candidatos', label: 'Candidatos' },
            { key: 'revisao',    label: `Revisão de Inscrições${pendingRevisao.length > 0 ? ` (${pendingRevisao.length})` : ''}` },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === tab.key ? { background: '#001b3d' } : {}}>
              {tab.label}
            </button>
          ))}
        </div> */}

        {/* ── ABA: REVISÃO DE INSCRIÇÕES ───────────────────────────────── */}
        {activeTab === 'revisao' && (
          <div className="space-y-4">

            {/* Pendentes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-blue-100 flex items-center justify-between" style={{ background: '#001b3d' }}>
                <div>
                  <h2 className="text-lg font-extrabold text-white tracking-wide">Aguardando Análise</h2>
                  <p className="text-xs text-blue-200 mt-0.5">Inscrições pendentes de validação</p>
                </div>
                {pendingRevisao.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {pendingRevisao.length} pendente{pendingRevisao.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {pendingRevisao.length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-sm">Nenhuma inscrição pendente.</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {pendingSlice.map(c => {
                    const etapa = c.etapas.find(e => e.etapa === 'INSCRICAO');
                    const cfg = getStatusCfg(etapa?.status ?? 'PENDENTE', 'INSCRICAO');
                    return (
                      <div key={c.id} className="px-6 py-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800">{c.nome}</p>
                          <p className="text-xs text-gray-400">{fmtCpf(c.cpf)} · {c.cargo} · {c.escola}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Inscrito em {c.inscricao ? new Date(c.inscricao.createdAt).toLocaleDateString('pt-BR') : '—'}
                          </p>
                          {new Date(c.updatedAt).getTime() - new Date(c.createdAt).getTime() > 2 * 60 * 1000 && (
                            <p className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 mt-0.5">
                              <RefreshCw className="w-3 h-3" /> Atualizou dados em {new Date(c.updatedAt).toLocaleString('pt-BR')}
                            </p>
                          )}
                          {locks[c.id] && (
                            <p className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 mt-0.5">
                              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
                              Em revisão por {locks[c.id]}
                            </p>
                          )}
                        </div>
                        <span className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                          {cfg.label}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => openReview(c)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-opacity ${locks[c.id] ? 'opacity-60' : ''}`}
                            style={{ background: locks[c.id] ? '#92400e' : '#001b3d' }}>
                            {locks[c.id] ? 'Em revisão…' : 'Analisar'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {pendingTotalPages > 1 && (
                <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                  <span className="text-xs text-gray-400">
                    Página {pendingPage} de {pendingTotalPages} · {pendingRevisao.length} inscrições
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => setPendingPage(p => Math.max(1, p - 1))} disabled={pendingPage === 1}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      ← Anterior
                    </button>
                    <button onClick={() => setPendingPage(p => Math.min(pendingTotalPages, p + 1))} disabled={pendingPage === pendingTotalPages}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      Próxima →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Histórico */}
            {revisados.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-blue-100 flex items-center justify-between" style={{ background: '#001b3d' }}>
                  <div>
                    <h2 className="text-lg font-extrabold text-white tracking-wide">Histórico</h2>
                    <p className="text-xs text-blue-200 mt-0.5">Inscrições já revisadas</p>
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {revisadosSlice.map(c => {
                    const etapa = c.etapas.find(e => e.etapa === 'INSCRICAO');
                    const cfg = getStatusCfg(etapa?.status ?? 'PENDENTE', 'INSCRICAO');
                    return (
                      <div key={c.id} className="px-6 py-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-700">{c.nome}</p>
                          <p className="text-xs text-gray-400">{fmtCpf(c.cpf)} · {c.cargo} · {c.escola}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Inscrito em {c.inscricao ? new Date(c.inscricao.createdAt).toLocaleDateString('pt-BR') : '—'}
                          </p>
                          {new Date(c.updatedAt).getTime() - new Date(c.createdAt).getTime() > 2 * 60 * 1000 && (
                            <p className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 mt-0.5">
                              <RefreshCw className="w-3 h-3" /> Atualizou dados em {new Date(c.updatedAt).toLocaleString('pt-BR')}
                            </p>
                          )}
                          {locks[c.id] && (
                            <p className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 mt-0.5">
                              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
                              Em revisão por {locks[c.id]}
                            </p>
                          )}
                          {etapa?.observacao && (
                            <p className="text-xs text-gray-400 mt-0.5 italic">"{etapa.observacao}"</p>
                          )}
                        </div>
                        <span className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                          {cfg.label}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => openReview(c)}
                            className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                            Reanalisar
                          </button>
                          {etapa?.status === 'APROVADO' && (
                            <button onClick={() => { setSelected(c); setEditingEtapa(null); }}
                              className="px-4 py-2 rounded-lg text-xs font-bold text-white"
                              style={{ background: '#001b3d' }}>
                              Gerenciar Etapas
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {revisadosTotalPages > 1 && (
                  <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                    <span className="text-xs text-gray-400">
                      Página {revisadosPage} de {revisadosTotalPages} · {revisados.length} inscrições
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => setRevisadosPage(p => Math.max(1, p - 1))} disabled={revisadosPage === 1}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        ← Anterior
                      </button>
                      <button onClick={() => setRevisadosPage(p => Math.min(revisadosTotalPages, p + 1))} disabled={revisadosPage === revisadosTotalPages}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        Próxima →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modal revisão de inscrição */}
      {reviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)' }}
          onClick={e => { if (e.target === e.currentTarget) closeReview(reviewing.id); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto">

            {/* Header */}
            <div className="px-6 py-5 flex items-start justify-between sticky top-0 bg-white border-b border-gray-100 z-10 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold" style={{ color: '#001b3d' }}>Analisar Inscrição</h3>
                <p className="text-sm text-gray-500">{reviewing.nome} · {fmtCpf(reviewing.cpf)}</p>
              </div>
              <button onClick={() => closeReview(reviewing.id)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>


            {/* Dados */}
            <div className="px-6 py-4 space-y-4">

              {/* Documentos enviados — aparecem primeiro para análise */}
              {(() => {
                const docs = DOC_FIELDS.filter(({ field }) => !!reviewing[field]);

                if (docs.length === 0) {
                  return (
                    <div className="flex items-center gap-2 px-3 py-3 rounded-lg border border-amber-100 bg-amber-50 text-amber-700 text-xs">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      Nenhum documento foi enviado por este candidato.
                    </div>
                  );
                }

                const rejectedDocLabels = docs
                  .filter(({ field }) => docChecks[field as string] === false)
                  .map(({ label }) => label);

                const candidatoAtualizou = new Date(reviewing.updatedAt).getTime() - new Date(reviewing.createdAt).getTime() > 2 * 60 * 1000;
                return (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Documentos enviados
                    </p>
                    <div className="space-y-1.5">
                      {docs.map(({ field, label }) => {
                        const fieldKey = field as string;
                        const check = docChecks[fieldKey] ?? null;
                        return (
                          <div key={fieldKey} className={`flex items-center gap-2 rounded-lg border transition-colors ${
                            check === true  ? 'border-green-200 bg-green-50' :
                            check === false ? 'border-red-200 bg-red-50' :
                            'border-gray-100 bg-gray-50'
                          }`}>
                            <a href={`${API_BASE}/api/uploads/${reviewing[field]}`} target="_blank" rel="noopener noreferrer"
                              className="flex-1 flex items-center gap-2 px-3 py-2.5 text-blue-700 text-xs font-medium hover:underline min-w-0">
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="truncate">{label}</span>
                              {candidatoAtualizou && (
                                <span className="flex-shrink-0 text-[9px] font-semibold text-amber-600 whitespace-nowrap">
                                  · Atualizado em {new Date(reviewing.updatedAt).toLocaleString('pt-BR')}
                                </span>
                              )}
                            </a>
                            <div className="flex gap-1 pr-2 flex-shrink-0">
                              <button
                                onClick={() => applyDocCheck(fieldKey, check === true ? null : true, reviewing!)}
                                className={`w-8 h-7 rounded text-xs font-bold transition-colors ${
                                  check === true ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-400 hover:bg-green-50 hover:text-green-600 hover:border-green-300'
                                }`}>✓</button>
                              <button
                                onClick={() => applyDocCheck(fieldKey, check === false ? null : false, reviewing!)}
                                className={`w-8 h-7 rounded text-xs font-bold transition-colors ${
                                  check === false ? 'bg-red-500 text-white' : 'bg-white border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-300'
                                }`}>✗</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {rejectedDocLabels.length > 0 && (
                      <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        Docs com problema: <span className="font-semibold">{rejectedDocLabels.join(', ')}</span>
                      </p>
                    )}
                  </div>
                );
              })()}

              <p className="text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                Verifique se os dados abaixo correspondem aos documentos enviados pelo candidato.
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm">
                {[
                  { label: 'Nome completo',  value: reviewing.nome },
                  { label: 'CPF',            value: fmtCpf(reviewing.cpf) },
                  { label: 'RG',             value: reviewing.rg || '—' },
                  { label: 'Órgão emissor',  value: reviewing.orgaoEmissor || '—' },
                  { label: 'Data de nasc.',  value: reviewing.dataNasc ? new Date(reviewing.dataNasc).toLocaleDateString('pt-BR') : '—' },
                  { label: 'Sexo',           value: reviewing.sexo || '—' },
                  { label: 'Estado civil',   value: reviewing.estadoCivil || '—' },
                  { label: 'E-mail',         value: reviewing.email },
                  { label: 'Telefone',       value: reviewing.telefone },
                  { label: 'Vínculo',        value: reviewing.vinculo || '—' },
                  { label: 'Cargo',          value: reviewing.cargo },
                  { label: 'Escola',         value: reviewing.escola },
                  ...(reviewing.vinculo !== 'Temporário' ? [{ label: 'Matrícula', value: reviewing.matricula || '—' }] : []),
                  { label: 'Formação',       value: reviewing.formacao || '—' },
                  { label: 'Especialização', value: reviewing.especializacao || '—' },
                  { label: 'Tempo de serv.', value: reviewing.tempoServico || '—' },
                ].map(row => (
                  <div key={row.label} className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">{row.label}</span>
                    <span className="text-sm text-gray-700 font-medium leading-snug">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Recurso do candidato */}
              {(() => {
                const inscricaoEtapa = reviewing.etapas.find(e => e.etapa === 'INSCRICAO');
                if (!inscricaoEtapa?.recurso) return null;
                return (
                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Recurso enviado pelo candidato
                    </p>
                    <p className="text-sm text-orange-800 leading-relaxed">"{inscricaoEtapa.recurso}"</p>
                  </div>
                );
              })()}

              {/* Ações */}
              {reviewAction === null && (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setReviewAction('approve')}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-colors">
                    Habilitar
                  </button>
                  <button onClick={() => {
                    const rejected = DOC_FIELDS
                      .filter(({ field }) => docChecks[field as string] === false && !!reviewing[field])
                      .map(({ label }) => label);
                    if (rejected.length > 0)
                      setRejectReason(`Documentos inválidos: ${rejected.join(', ')}`);
                    setReviewAction('reject');
                  }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors">
                    Inabilitar
                  </button>
                </div>
              )}

              {reviewAction === 'approve' && (
                <div className="space-y-3 pt-2">
                  <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    Confirmar habilitação da inscrição de <strong>{reviewing.nome}</strong>?
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => setReviewAction(null)}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50">
                      Voltar
                    </button>
                    <button onClick={() => handleReview(reviewing, 'approve')} disabled={reviewSaving}
                      className="flex-1 py-2 rounded-xl text-sm font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors">
                      {reviewSaving ? 'Salvando…' : 'Confirmar Habilitação'}
                    </button>
                  </div>
                </div>
              )}

              {reviewAction === 'reject' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Justificativa <span className="text-red-500">*</span>
                      <span className="text-gray-400 ml-1">(será exibida ao candidato)</span>
                    </label>
                    <textarea rows={3} value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="Descreva o motivo da inabilitação..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setReviewAction(null)}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50">
                      Voltar
                    </button>
                    <button onClick={() => handleReview(reviewing, 'reject', rejectReason)}
                      disabled={reviewSaving || !rejectReason.trim()}
                      className="flex-1 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors">
                      {reviewSaving ? 'Salvando…' : 'Confirmar Inabilitação'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal candidato (etapas) */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)' }}
          onClick={e => { if (e.target === e.currentTarget) { setSelected(null); setEditingEtapa(null); } }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">

            {/* Modal header */}
            <div className="px-6 py-5 flex items-start justify-between sticky top-0 bg-white border-b border-gray-100 z-10 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold" style={{ color: '#001b3d' }}>{selected.nome}</h3>
                <p className="text-sm text-gray-500">{fmtCpf(selected.cpf)} · {selected.cargo}</p>
                <p className="text-xs text-gray-400 mt-0.5">{selected.escola} · {selected.municipio}</p>
              </div>
              <div className="flex items-center gap-3">
                {selected.inscricao && (
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400">Protocolo</p>
                    <p className="text-xs font-mono text-gray-600">{selected.inscricao.protocolo.slice(0, 14)}…</p>
                  </div>
                )}
                <button onClick={() => { setSelected(null); setEditingEtapa(null); }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-3">

              {/* Etapas */}
              {selected.etapas.map((etapa, idx) => {
                const Icon = ETAPA_ICONS[etapa.etapa] ?? FileText;
                const inscricaoAprovada = selected.etapas.find(e => e.etapa === 'INSCRICAO')?.status === 'APROVADO';
                const isLocked = etapa.etapa === 'INSCRICAO' ? false
                  : etapa.etapa === 'HABILITACAO_DOCUMENTAL' ? !inscricaoAprovada
                  : true;
                const cfg = getStatusCfg(etapa.status, etapa.etapa);
                const StatusIcon = cfg.icon;
                const isEditing = editingEtapa === etapa.etapa;
                const stageData = getStageData(etapa.etapa, selected, selected.etapas);

                return (
                  <div key={etapa.etapa}
                    className={`rounded-xl border overflow-hidden ${isLocked ? 'border-gray-100 opacity-60' : isEditing ? 'border-blue-300' : cfg.border}`}>

                    {/* Stage header row */}
                    <div className={`p-3 flex items-center gap-3 ${isLocked ? 'bg-gray-50' : isEditing ? 'bg-blue-50' : 'bg-white'}`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isLocked ? 'bg-gray-200' : ''}`}
                        style={!isLocked ? { background: '#001b3d' } : {}}>
                        <Icon className={`w-4 h-4 ${isLocked ? 'text-gray-400' : 'text-white'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-400 font-mono">0{idx + 1}</span>
                          <span className={`text-sm font-semibold ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>{etapa.label}</span>
                        </div>
                        {!isEditing && !isLocked && etapa.pontuacao !== null && (
                          <p className="text-xs text-gray-500">Pontuação: <span className="font-semibold">{etapa.pontuacao} pts</span></p>
                        )}
                        {!isEditing && !isLocked && etapa.observacao && (
                          <p className="text-xs text-gray-400 italic truncate">{etapa.observacao}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isLocked ? (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-400 border-gray-200">
                            <Lock className="w-3 h-3" /> Bloqueada
                          </span>
                        ) : (
                          <>
                            <span className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                              <StatusIcon className="w-3 h-3" /> {cfg.label}
                            </span>
                            {etapa.id && (
                              <button
                                onClick={() => isEditing ? setEditingEtapa(null) : startEdit(etapa)}
                                className="px-3 py-1 rounded-lg text-xs font-semibold border transition-colors"
                                style={isEditing
                                  ? { background: '#f3f4f6', color: '#6b7280', borderColor: '#d1d5db' }
                                  : { background: '#001b3d', color: '#fff', borderColor: '#001b3d' }}>
                                {isEditing ? 'Cancelar' : 'Analisar'}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Expanded edit panel */}
                    {isEditing && (
                      <div className="border-t border-blue-100 bg-white">

                        {/* Dados do candidato para esta etapa */}
                        {stageData.length > 0 && (
                          <div className="px-4 pt-4 pb-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5" />
                              {etapa.etapa === 'RESULTADO_FINAL' || etapa.etapa === 'CERTIFICACAO'
                                ? 'Resumo das etapas'
                                : 'Dados do candidato para verificação'}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 p-3 rounded-lg border border-gray-100 bg-gray-50">
                              {stageData.map(row => (
                                <div key={row.label} className="flex flex-col">
                                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">{row.label}</span>
                                  <span className="text-sm text-gray-700 font-medium leading-snug">{row.value}</span>
                                </div>
                              ))}
                            </div>
                            {ETAPA_NOTES[etapa.etapa] && (
                              <p className="mt-2 text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                                {ETAPA_NOTES[etapa.etapa]}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Checklist individual de documentos — apenas HABILITACAO_DOCUMENTAL */}
                        {etapa.etapa === 'HABILITACAO_DOCUMENTAL' && (
                          <div className="px-4 pb-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                              Validação Individual de Documentos
                            </p>
                            <div className="space-y-1.5">
                              {DOC_FIELDS.filter(({ field }) => !!selected[field]).length === 0 ? (
                                <p className="text-xs text-gray-400 italic">Nenhum documento enviado.</p>
                              ) : (
                                DOC_FIELDS.filter(({ field }) => !!selected[field]).map(({ field, label }) => {
                                  const check = docChecks[field] ?? null;
                                  return (
                                    <div key={field} className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                                      check === true ? 'border-green-200 bg-green-50' :
                                      check === false ? 'border-red-200 bg-red-50' :
                                      'border-gray-100 bg-gray-50'
                                    }`}>
                                      <a href={`${API_BASE}/api/uploads/${selected[field]}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="flex-1 flex items-center gap-1.5 text-blue-700 text-xs font-medium hover:underline min-w-0">
                                        <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="truncate">{label}</span>
                                      </a>
                                      <div className="flex gap-1 flex-shrink-0">
                                        <button onClick={() => setDocChecks(p => ({ ...p, [field]: true }))}
                                          className={`w-8 h-7 rounded text-xs font-bold transition-colors ${
                                            check === true ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-400 hover:bg-green-50 hover:text-green-600'
                                          }`}>✓</button>
                                        <button onClick={() => setDocChecks(p => ({ ...p, [field]: false }))}
                                          className={`w-8 h-7 rounded text-xs font-bold transition-colors ${
                                            check === false ? 'bg-red-500 text-white' : 'bg-white border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-600'
                                          }`}>✗</button>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        )}

                        {/* Formulário de validação */}
                        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-100">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-3">Validação</p>

                          {/* Status */}
                          <div>
                            <p className="text-xs text-gray-500 mb-2">Status</p>
                            <div className="grid grid-cols-3 gap-2">
                              {STATUS_OPTIONS.map(opt => (
                                <button key={opt.value}
                                  onClick={() => setEditForm(f => ({ ...f, status: opt.value }))}
                                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                                    editForm.status === opt.value
                                      ? `${opt.bg} ${opt.color} ${opt.border} shadow-sm ring-1 ring-current`
                                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                  }`}>
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button onClick={() => handleSave(etapa)} disabled={saving}
                              className="px-5 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-60 transition-opacity hover:opacity-90"
                              style={{ background: '#001b3d' }}>
                              {saving ? 'Salvando...' : 'Salvar validação'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end rounded-b-2xl">
              <button onClick={() => { setSelected(null); setEditingEtapa(null); }}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal — Enviar mensagem ao candidato */}

    </div>
  );
}
