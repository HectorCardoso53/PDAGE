'use client';

'use client';

import { useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, ChevronLeft, CheckCircle, Upload, User, Briefcase, FileText } from 'lucide-react';
import { apiFetch } from '@/lib/api';

const steps = [
  { id: 1, label: 'Dados Pessoais', icon: User },
  { id: 2, label: 'Dados Funcionais', icon: Briefcase },
  { id: 3, label: 'Documentos', icon: FileText },
  { id: 4, label: 'Confirmação', icon: CheckCircle },
];

const inputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const fieldsetClass = "grid grid-cols-1 sm:grid-cols-2 gap-4";

const mask = {
  cpf: (v: string) =>
    v.replace(/\D/g, '').slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'),

  phone: (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 10)
      return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
    return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
  },

  cep: (v: string) =>
    v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2'),

  numeric: (v: string) =>
    v.replace(/\D/g, ''),

  rgCnh: (v: string) =>
    v.replace(/[^0-9A-Za-z\-]/g, '').slice(0, 15),
};

type DiplomaType = '' | 'pedagogia' | 'outras';

type FormState = {
  nome: string; cpf: string; rg: string; orgaoEmissor: string; dataNasc: string;
  sexo: string; estadoCivil: string; telefone: string; email: string;
  cep: string; logradouro: string; numero: string; bairro: string; cidade: string;
  matricula: string; cargo: string; escola: string; municipio: string;
  tempoServico: string; formacao: string; especializacao: string;
  declaracaoDados: boolean;
  docRgCnh: File | null;
  docCpf: File | null;
  docResidencia: File | null;
  docTituloEleitor: File | null;
  docQuitacao: File | null;
  docReservista: File | null;
  diplomaTipo: DiplomaType;
  docDiplomaPedagogia: File | null;
  docDiplomaOutras: File | null;
  docPosGraduacao: File | null;
  docLotacao: File | null;
};

export default function InscricaoPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [protocolo, setProtocolo] = useState('');
  const [fileError, setFileError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState<FormState>({
    nome: '', cpf: '', rg: '', orgaoEmissor: '', dataNasc: '', sexo: '', estadoCivil: '',
    telefone: '', email: '', cep: '', logradouro: '', numero: '', bairro: '', cidade: '',
    matricula: '', cargo: '', escola: '', municipio: 'Oriximiná',
    tempoServico: '', formacao: '', especializacao: '',
    docRgCnh: null, docCpf: null, docResidencia: null,
    docTituloEleitor: null, docQuitacao: null, docReservista: null,
    diplomaTipo: '', docDiplomaPedagogia: null, docDiplomaOutras: null,
    docPosGraduacao: null, docLotacao: null,
    declaracaoDados: false,
  });

  const set = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleFile = (field: keyof FormState, e: React.ChangeEvent<HTMLInputElement>) => {
    set(field, (e.target.files?.[0] ?? null) as FormState[typeof field]);
    setFileError('');
  };

  const validateDocs = (): string => {
    if (!form.docRgCnh) return 'Envie o RG ou CNH (item a).';
    if (!form.docCpf) return 'Envie o CPF (item b).';
    if (!form.docResidencia) return 'Envie o Comprovante de Residência (item c).';
    if (!form.docTituloEleitor) return 'Envie o Título de Eleitor (item d).';
    if (!form.docQuitacao) return 'Envie o Comprovante de Quitação Eleitoral (item d).';
    if (form.sexo === 'Masculino' && !form.docReservista)
      return 'Envie a Carteira de Reservista (item e — obrigatório para o sexo masculino).';
    if (!form.diplomaTipo) return 'Selecione o tipo de diploma de licenciatura (item f ou g).';
    if (form.diplomaTipo === 'pedagogia' && !form.docDiplomaPedagogia)
      return 'Envie o Diploma de Licenciatura Plena em Pedagogia (item f).';
    if (form.diplomaTipo === 'outras' && !form.docDiplomaOutras)
      return 'Envie o Diploma de Licenciatura Plena em outras áreas (item g).';
    // Item h: pós-graduação obrigatória apenas para licenciados em outras áreas (edital)
    if (form.diplomaTipo === 'outras' && !form.docPosGraduacao)
      return 'Envie o Certificado de Pós-graduação em Administração ou Gestão Escolar (item h — obrigatório para licenciados em outras áreas).';
    if (!form.docLotacao) return 'Envie o Comprovante de Lotação Escolar (item i).';
    return '';
  };

  const handleNext = () => {
    if (step === 3) {
      const err = validateDocs();
      if (err) { setFileError(err); return; }
      setFileError('');
    } else {
      if (formRef.current && !formRef.current.reportValidity()) return;
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    try {
      const fd = new FormData();

      // Campos de texto
      fd.append('nome',          form.nome);
      fd.append('cpf',           form.cpf);
      fd.append('dataNasc',      form.dataNasc);
      fd.append('sexo',          form.sexo);
      fd.append('estadoCivil',   form.estadoCivil);
      fd.append('rg',            form.rg);
      fd.append('orgaoEmissor',  form.orgaoEmissor);
      fd.append('telefone',      form.telefone);
      fd.append('email',         form.email);
      fd.append('cep',           form.cep);
      fd.append('logradouro',    form.logradouro);
      fd.append('numero',        form.numero);
      fd.append('bairro',        form.bairro);
      fd.append('cidade',        form.cidade);
      fd.append('matricula',     form.matricula);
      fd.append('cargo',         form.cargo);
      fd.append('escola',        form.escola);
      fd.append('municipio',     form.municipio);
      fd.append('tempoServico',  form.tempoServico);
      fd.append('formacao',      form.formacao);
      fd.append('especializacao', form.especializacao);

      // Arquivos
      if (form.docRgCnh)        fd.append('docRgCnh',         form.docRgCnh);
      if (form.docCpf)          fd.append('docCpf',           form.docCpf);
      if (form.docResidencia)   fd.append('docResidencia',    form.docResidencia);
      if (form.docTituloEleitor) fd.append('docTituloEleitor', form.docTituloEleitor);
      if (form.docQuitacao)     fd.append('docQuitacao',      form.docQuitacao);
      if (form.docReservista)   fd.append('docReservista',    form.docReservista);
      const diploma = form.docDiplomaPedagogia ?? form.docDiplomaOutras;
      if (diploma)              fd.append('docDiploma',       diploma);
      if (form.docPosGraduacao) fd.append('docPosGraduacao', form.docPosGraduacao);
      if (form.docLotacao)      fd.append('docLotacao',       form.docLotacao);

      const res = await apiFetch('/api/inscricao', {
        method: 'POST',
        body: fd,
        // Sem Content-Type — o browser define o boundary do multipart automaticamente
      });

      const data = await res.json();

      if (res.status === 409) {
        setSubmitError(data.message);
        return;
      }

      if (!res.ok) {
        setSubmitError(data.message ?? 'Erro ao enviar inscrição. Tente novamente.');
        return;
      }

      localStorage.setItem('pdage_inscrito', '1');
      setProtocolo(data.protocolo ?? '');
      setSubmitted(true);
    } catch {
      setSubmitError('Erro de conexão com o servidor. Verifique sua internet e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 pb-16 px-4" style={{ backgroundColor: '#f4f6f8' }}>
          <div className="max-w-2xl mx-auto">

            {/* Cabeçalho de sucesso */}
            <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#001b3d' }}>
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: '#001b3d' }}>Você foi inscrito!</h2>
              <p className="text-gray-500 text-sm mb-4">Sua inscrição foi recebida. Aguarde a validação da comissão responsável.</p>
              {protocolo && (
                <div className="inline-block rounded-xl px-6 py-3 mb-2" style={{ background: '#f0f7ff', border: '2px solid #38b6ff' }}>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Número de Protocolo</p>
                  <p className="text-lg font-bold font-mono tracking-widest" style={{ color: '#001b3d' }}>{protocolo}</p>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">Guarde este número. A análise da sua inscrição será realizada pela comissão através do painel administrativo.</p>
            </div>

            {/* Resumo dos dados pessoais */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4 text-sm text-gray-700">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Dados Pessoais</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <span className="text-gray-400">Nome</span><span className="font-medium">{form.nome}</span>
                <span className="text-gray-400">CPF</span><span className="font-medium">{form.cpf}</span>
                <span className="text-gray-400">Data de Nascimento</span><span className="font-medium">{form.dataNasc}</span>
                <span className="text-gray-400">RG / CNH</span><span className="font-medium">{form.rg} — {form.orgaoEmissor}</span>
                <span className="text-gray-400">Sexo</span><span className="font-medium">{form.sexo}</span>
                <span className="text-gray-400">Estado Civil</span><span className="font-medium">{form.estadoCivil}</span>
                <span className="text-gray-400">Telefone</span><span className="font-medium">{form.telefone}</span>
                <span className="text-gray-400">E-mail</span><span className="font-medium">{form.email}</span>
                <span className="text-gray-400">Endereço</span><span className="font-medium">{form.logradouro}, {form.numero} — {form.bairro}, {form.cidade}</span>
              </div>
            </div>

            {/* Resumo dos dados funcionais */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4 text-sm text-gray-700">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Dados Funcionais</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <span className="text-gray-400">Matrícula</span><span className="font-medium">{form.matricula}</span>
                <span className="text-gray-400">Cargo</span><span className="font-medium">{form.cargo}</span>
                <span className="text-gray-400">Escola</span><span className="font-medium">{form.escola}</span>
                <span className="text-gray-400">Município</span><span className="font-medium">{form.municipio}</span>
                <span className="text-gray-400">Tempo de Serviço</span><span className="font-medium">{form.tempoServico}</span>
                <span className="text-gray-400">Formação</span><span className="font-medium">{form.formacao}</span>
                <span className="text-gray-400">Especialização</span><span className="font-medium">{form.especializacao}</span>
                <span className="text-gray-400">Diploma</span>
                <span className="font-medium">
                  {form.diplomaTipo === 'pedagogia' ? 'Licenciatura em Pedagogia' : form.diplomaTipo === 'outras' ? 'Licenciatura em outras áreas' : '—'}
                </span>
              </div>
            </div>

            {/* Documentos */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 text-sm text-gray-700">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Documentos enviados</p>
              <ul className="space-y-2">
                {[
                  { label: 'RG ou CNH', file: form.docRgCnh },
                  { label: 'CPF', file: form.docCpf },
                  { label: 'Comprovante de Residência', file: form.docResidencia },
                  { label: 'Título de Eleitor', file: form.docTituloEleitor },
                  { label: 'Quitação Eleitoral', file: form.docQuitacao },
                  ...(form.sexo === 'Masculino' ? [{ label: 'Carteira de Reservista', file: form.docReservista }] : []),
                  ...(form.diplomaTipo === 'pedagogia' ? [{ label: 'Diploma — Licenciatura em Pedagogia', file: form.docDiplomaPedagogia }] : []),
                  ...(form.diplomaTipo === 'outras' ? [{ label: 'Diploma — Licenciatura em outras áreas', file: form.docDiplomaOutras }] : []),
                  ...(form.especializacao !== 'Não' ? [{ label: 'Certificado de Pós-graduação', file: form.docPosGraduacao }] : []),
                  { label: 'Comprovante de Lotação Escolar', file: form.docLotacao },
                ].map(({ label, file }) => (
                  <li key={label} className="flex items-center gap-2">
                    <span className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold bg-green-500 text-white">✓</span>
                    <span className="text-gray-700">{label}</span>
                    {file && <span className="text-gray-400 text-xs truncate">— {file.name}</span>}
                  </li>
                ))}
              </ul>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/login" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white" style={{ background: '#001b3d' }}>
                Acessar Área do Candidato
              </a>
              <a href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50">
                Voltar ao início
              </a>
            </div>

          </div>
        </main>
        <Footer />
      </>
    );
  }

  const FileCard = ({
    field, tag, label, hint, optional,
  }: {
    field: keyof FormState; tag: string; label: string; hint?: string; optional?: boolean;
  }) => {
    const file = form[field] as File | null;
    return (
      <div className={`border-2 border-dashed rounded-xl p-4 transition-colors ${file ? 'border-green-400 bg-green-50' : optional ? 'border-gray-200 hover:border-gray-300' : 'border-gray-300 hover:border-blue-300'}`}>
        <div className="flex items-start gap-3">
          <span
            className="flex-shrink-0 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center text-white mt-0.5"
            style={{ background: optional ? '#6b7280' : '#001b3d' }}
          >{tag}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-700 mb-0.5">
              {label}
              {optional && <span className="ml-1.5 text-xs font-normal text-gray-400">(opcional)</span>}
            </p>
            {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
            <label
              className="inline-flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium text-white"
              style={{ background: file ? '#15803d' : '#001b3d' }}
            >
              <Upload className="w-3.5 h-3.5" />
              {file ? 'Trocar arquivo' : 'Selecionar PDF'}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={e => handleFile(field, e)}
              />
            </label>
            {file && <p className="text-xs text-green-700 mt-1.5 font-medium truncate">✓ {file.name}</p>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-16" style={{ backgroundColor: '#f4f6f8' }}>

        {/* Page header */}
        <div className="py-10 text-center" style={{ background: '#001b3d' }}>
          <h1 className="text-3xl font-bold text-white mb-1">Inscrição — Processo Seletivo</h1>
          <p className="text-sm" style={{ color: '#38b6ff' }}>Meritus · Gestores Escolares · Oriximiná/PA</p>
        </div>

        {/* Stepper */}
        <div className="max-w-3xl mx-auto px-4 mt-8 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const active = step === s.id;
              const done = step > s.id;
              return (
                <div key={s.id} className="flex-1 flex flex-col items-center relative">
                  {i < steps.length - 1 && (
                    <div className={`absolute top-5 left-1/2 w-full h-0.5 z-0 ${done ? 'bg-blue-400' : 'bg-gray-200'}`} />
                  )}
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${active ? 'border-blue-400 bg-blue-400 text-white' : done ? 'border-blue-400 bg-blue-400 text-white' : 'border-gray-300 bg-white text-gray-400'}`}>
                    {done ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`mt-2 text-xs font-medium hidden sm:block ${active ? 'text-blue-500' : done ? 'text-blue-400' : 'text-gray-400'}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4" noValidate>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">

            {/* ── Step 1 — Dados Pessoais ── */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4" style={{ color: '#001b3d' }}>Dados Pessoais</h2>
                <div>
                  <label className={labelClass}>Nome completo *</label>
                  <input required className={inputClass} value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Nome conforme documento de identidade" />
                </div>
                <div className={fieldsetClass}>
                  <div>
                    <label className={labelClass}>CPF *</label>
                    <input required inputMode="numeric" className={inputClass} value={form.cpf} onChange={e => set('cpf', mask.cpf(e.target.value))} placeholder="000.000.000-00" maxLength={14} />
                  </div>
                  <div>
                    <label className={labelClass}>Data de Nascimento *</label>
                    <input required type="date" className={inputClass} value={form.dataNasc} onChange={e => set('dataNasc', e.target.value)} />
                  </div>
                </div>
                <div className={fieldsetClass}>
                  <div>
                    <label className={labelClass}>RG ou CNH *</label>
                    <input required className={inputClass} value={form.rg} onChange={e => set('rg', mask.rgCnh(e.target.value))} placeholder="Número do documento" maxLength={15} />
                  </div>
                  <div>
                    <label className={labelClass}>Órgão Emissor *</label>
                    <input required className={inputClass} value={form.orgaoEmissor} onChange={e => set('orgaoEmissor', e.target.value)} placeholder="PC/PA" />
                  </div>
                </div>
                <div className={fieldsetClass}>
                  <div>
                    <label className={labelClass}>Sexo *</label>
                    <select required className={inputClass} value={form.sexo} onChange={e => set('sexo', e.target.value)}>
                      <option value="">Selecione</option>
                      <option>Masculino</option>
                      <option>Feminino</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Estado Civil *</label>
                    <select required className={inputClass} value={form.estadoCivil} onChange={e => set('estadoCivil', e.target.value)}>
                      <option value="">Selecione</option>
                      <option>Solteiro(a)</option>
                      <option>Casado(a)</option>
                      <option>Divorciado(a)</option>
                      <option>Viúvo(a)</option>
                      <option>União estável</option>
                    </select>
                  </div>
                </div>
                <div className={fieldsetClass}>
                  <div>
                    <label className={labelClass}>Telefone / WhatsApp *</label>
                    <input required inputMode="numeric" className={inputClass} value={form.telefone} onChange={e => set('telefone', mask.phone(e.target.value))} placeholder="(93) 9 0000-0000" maxLength={16} />
                  </div>
                  <div>
                    <label className={labelClass}>E-mail *</label>
                    <input required type="email" className={inputClass} value={form.email} onChange={e => set('email', e.target.value)} placeholder="seu@email.com" />
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Endereço</p>
                  <div className={fieldsetClass}>
                    <div>
                      <label className={labelClass}>CEP *</label>
                      <input required inputMode="numeric" className={inputClass} value={form.cep} onChange={e => set('cep', mask.cep(e.target.value))} placeholder="68270-000" maxLength={9} />
                    </div>
                    <div>
                      <label className={labelClass}>Número *</label>
                      <input required inputMode="numeric" className={inputClass} value={form.numero} onChange={e => set('numero', mask.numeric(e.target.value))} placeholder="Nº" maxLength={10} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className={labelClass}>Logradouro *</label>
                    <input required className={inputClass} value={form.logradouro} onChange={e => set('logradouro', e.target.value)} placeholder="Rua, Avenida..." />
                  </div>
                  <div className={`${fieldsetClass} mt-4`}>
                    <div>
                      <label className={labelClass}>Bairro *</label>
                      <input required className={inputClass} value={form.bairro} onChange={e => set('bairro', e.target.value)} />
                    </div>
                    <div>
                      <label className={labelClass}>Cidade *</label>
                      <input required className={inputClass} value={form.cidade} onChange={e => set('cidade', e.target.value)} />
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer mt-6 pt-5 border-t border-gray-100">
                  <input
                    type="checkbox"
                    required
                    checked={form.declaracaoDados}
                    onChange={e => set('declaracaoDados', e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-blue-500 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-600">
                    Declaro que todas as informações prestadas neste formulário são verdadeiras e condizentes com a realidade.
                    Estou ciente de que a veracidade dos dados é de <strong>inteira responsabilidade do declarante</strong>,
                    sujeitando-me às sanções administrativas e legais cabíveis em caso de falsidade ou omissão.
                  </span>
                </label>
              </div>
            )}

            {/* ── Step 2 — Dados Funcionais ── */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4" style={{ color: '#001b3d' }}>Dados Funcionais</h2>
                <div className={fieldsetClass}>
                  <div>
                    <label className={labelClass}>Matrícula Funcional *</label>
                    <input required inputMode="numeric" className={inputClass} value={form.matricula} onChange={e => set('matricula', mask.numeric(e.target.value))} placeholder="Nº de matrícula" maxLength={20} />
                  </div>
                  <div>
                    <label className={labelClass}>Cargo Atual *</label>
                    <input required className={inputClass} value={form.cargo} onChange={e => set('cargo', e.target.value)} placeholder="Ex: Professor(a)" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Escola / Unidade de Ensino *</label>
                  <input required className={inputClass} value={form.escola} onChange={e => set('escola', e.target.value)} placeholder="Nome da escola" />
                </div>
                <div>
                  <label className={labelClass}>Tempo de Serviço na Educação *</label>
                  <select required className={inputClass} value={form.tempoServico} onChange={e => set('tempoServico', e.target.value)}>
                    <option value="">Selecione</option>
                    <option>Menos de 2 anos</option>
                    <option>2 a 5 anos</option>
                    <option>5 a 10 anos</option>
                    <option>10 a 15 anos</option>
                    <option>Mais de 15 anos</option>
                  </select>
                </div>
                <div className={fieldsetClass}>
                  <div>
                    <label className={labelClass}>Formação Acadêmica *</label>
                    <select required className={inputClass} value={form.formacao} onChange={e => set('formacao', e.target.value)}>
                      <option value="">Selecione</option>
                      <option>Licenciatura</option>
                      <option>Bacharelado</option>
                      <option>Pós-graduação (Especialização)</option>
                      <option>Mestrado</option>
                      <option>Doutorado</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Especialização em Gestão Escolar *</label>
                    <select required className={inputClass} value={form.especializacao} onChange={e => set('especializacao', e.target.value)}>
                      <option value="">Selecione</option>
                      <option>Sim</option>
                      <option>Não</option>
                      <option>Em curso</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3 — Documentos ── */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-1" style={{ color: '#001b3d' }}>Documentos</h2>
                <p className="text-sm text-gray-500 mb-2">
                  Envie todos os arquivos em PDF (ou JPG/PNG). Tamanho máximo: 5 MB por arquivo.
                </p>

                {fileError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {fileError}
                  </div>
                )}

                {/* a — RG ou CNH */}
                <FileCard field="docRgCnh" tag="a" label="RG ou CNH" />

                {/* b — CPF */}
                <FileCard field="docCpf" tag="b" label="CPF" />

                {/* c — Comprovante de Residência */}
                <FileCard field="docResidencia" tag="c" label="Comprovante de Residência" />

                {/* d — Título de Eleitor + Quitação (2 campos separados) */}
                <FileCard field="docTituloEleitor" tag="d" label="Título de Eleitor" />
                <FileCard field="docQuitacao" tag="d" label="Comprovante de Quitação Eleitoral" hint="Disponível no site do TSE" />

                {/* e — Reservista (só masculino) */}
                {form.sexo === 'Masculino' && (
                  <FileCard field="docReservista" tag="e" label="Carteira de Reservista" hint="Obrigatório para o sexo masculino" />
                )}

                {/* f / g — Diploma: escolha exclusiva */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Diploma de Licenciatura Plena — selecione uma opção *
                  </p>

                  {/* Opção f */}
                  <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${form.diplomaTipo === 'pedagogia' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-200'}`}>
                    <input
                      type="radio"
                      name="diplomaTipo"
                      className="accent-blue-500 w-4 h-4 flex-shrink-0"
                      checked={form.diplomaTipo === 'pedagogia'}
                      onChange={() => {
                        set('diplomaTipo', 'pedagogia');
                        set('docDiplomaOutras', null);
                        set('docPosGraduacao', null);
                        setFileError('');
                      }}
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-800">f) Licenciatura Plena em Pedagogia</span>
                    </div>
                  </label>

                  {/* Upload f — Pedagogia */}
                  {form.diplomaTipo === 'pedagogia' && (
                    <div className="ml-7 space-y-3">
                      <FileCard field="docDiplomaPedagogia" tag="f" label="Diploma de Licenciatura Plena em Pedagogia" />
                      {/* Pós-graduação é opcional para Pedagogia (não exigida pelo edital, item h é só para outras áreas) */}
                      <FileCard
                        field="docPosGraduacao"
                        tag="h"
                        label="Certificado de Pós-graduação em Administração ou Gestão Escolar"
                        hint="Carga horária mínima de 360 horas"
                        optional
                      />
                    </div>
                  )}

                  {/* Opção g */}
                  <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${form.diplomaTipo === 'outras' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-200'}`}>
                    <input
                      type="radio"
                      name="diplomaTipo"
                      className="accent-blue-500 w-4 h-4 flex-shrink-0"
                      checked={form.diplomaTipo === 'outras'}
                      onChange={() => {
                        set('diplomaTipo', 'outras');
                        set('docDiplomaPedagogia', null);
                        setFileError('');
                      }}
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-800">g) Licenciatura Plena em outras áreas</span>
                    </div>
                  </label>

                  {/* Uploads g + h — obrigatórios para outras áreas */}
                  {form.diplomaTipo === 'outras' && (
                    <div className="ml-7 space-y-3">
                      <FileCard field="docDiplomaOutras" tag="g" label="Diploma de Licenciatura Plena em outras áreas" />
                      {/* Item h: obrigatório para licenciados em outras áreas (edital) */}
                      <FileCard
                        field="docPosGraduacao"
                        tag="h"
                        label="Certificado de Pós-graduação em Administração ou Gestão Escolar"
                        hint="Carga horária mínima de 360 horas — obrigatório para licenciados em outras áreas"
                      />
                    </div>
                  )}
                </div>

                {/* i — Lotação */}
                <FileCard
                  field="docLotacao"
                  tag="i"
                  label="Comprovante de Lotação Escolar"
                  hint="Emitido pela Secretaria Municipal de Educação de Oriximiná/PA"
                />
              </div>
            )}

            {/* ── Step 4 — Confirmação ── */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold mb-4" style={{ color: '#001b3d' }}>Confirmação</h2>

                {/* Dados Pessoais */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 space-y-3 text-sm text-gray-700">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Dados Pessoais</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    <span className="text-gray-400">Nome</span><span className="font-medium">{form.nome}</span>
                    <span className="text-gray-400">CPF</span><span className="font-medium">{form.cpf}</span>
                    <span className="text-gray-400">Data de Nascimento</span><span className="font-medium">{form.dataNasc}</span>
                    <span className="text-gray-400">RG / CNH</span><span className="font-medium">{form.rg}</span>
                    <span className="text-gray-400">Órgão Emissor</span><span className="font-medium">{form.orgaoEmissor}</span>
                    <span className="text-gray-400">Sexo</span><span className="font-medium">{form.sexo}</span>
                    <span className="text-gray-400">Estado Civil</span><span className="font-medium">{form.estadoCivil}</span>
                    <span className="text-gray-400">Telefone</span><span className="font-medium">{form.telefone}</span>
                    <span className="text-gray-400">E-mail</span><span className="font-medium">{form.email}</span>
                    <span className="text-gray-400">CEP</span><span className="font-medium">{form.cep}</span>
                    <span className="text-gray-400">Logradouro</span><span className="font-medium">{form.logradouro}, {form.numero}</span>
                    <span className="text-gray-400">Bairro / Cidade</span><span className="font-medium">{form.bairro} — {form.cidade}</span>
                  </div>
                </div>

                {/* Dados Funcionais */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 space-y-3 text-sm text-gray-700">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Dados Funcionais</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    <span className="text-gray-400">Matrícula</span><span className="font-medium">{form.matricula}</span>
                    <span className="text-gray-400">Cargo</span><span className="font-medium">{form.cargo}</span>
                    <span className="text-gray-400">Escola</span><span className="font-medium">{form.escola}</span>
                    <span className="text-gray-400">Município</span><span className="font-medium">{form.municipio}</span>
                    <span className="text-gray-400">Tempo de Serviço</span><span className="font-medium">{form.tempoServico}</span>
                    <span className="text-gray-400">Formação</span><span className="font-medium">{form.formacao}</span>
                    <span className="text-gray-400">Especialização Gestão</span><span className="font-medium">{form.especializacao}</span>
                    <span className="text-gray-400">Diploma</span>
                    <span className="font-medium">
                      {form.diplomaTipo === 'pedagogia' ? 'Licenciatura em Pedagogia' : form.diplomaTipo === 'outras' ? 'Licenciatura em outras áreas' : '—'}
                    </span>
                  </div>
                </div>

                {/* Documentos */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Documentos enviados</p>
                  <ul className="space-y-1.5">
                    {[
                      { label: 'RG ou CNH', file: form.docRgCnh },
                      { label: 'CPF', file: form.docCpf },
                      { label: 'Comprovante de Residência', file: form.docResidencia },
                      { label: 'Título de Eleitor', file: form.docTituloEleitor },
                      { label: 'Quitação Eleitoral', file: form.docQuitacao },
                      ...(form.sexo === 'Masculino' ? [{ label: 'Carteira de Reservista', file: form.docReservista }] : []),
                      ...(form.diplomaTipo === 'pedagogia' ? [{ label: 'Diploma — Licenciatura em Pedagogia', file: form.docDiplomaPedagogia }] : []),
                      ...(form.diplomaTipo === 'outras' ? [{ label: 'Diploma — Licenciatura em outras áreas', file: form.docDiplomaOutras }] : []),
                      ...(form.especializacao !== 'Não' ? [{ label: 'Certificado de Pós-graduação', file: form.docPosGraduacao }] : []),
                      { label: 'Comprovante de Lotação Escolar', file: form.docLotacao },
                    ].map(({ label, file }) => (
                      <li key={label} className="flex items-center gap-2">
                        <span className={`w-4 h-4 flex-shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${file ? 'bg-green-500 text-white' : 'bg-red-400 text-white'}`}>
                          {file ? '✓' : '✗'}
                        </span>
                        <span className={file ? 'text-gray-700' : 'text-red-500'}>{label}</span>
                        {file && <span className="text-gray-400 truncate text-xs">— {file.name}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
                {submitError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {submitError}
                  </div>
                )}

              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </button>
              ) : <div />}
              {step < 4 ? (
                <button type="button" onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
                  style={{ background: '#001b3d' }}>
                  Próximo <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="button"
                  disabled={submitting}
                  onClick={() => setShowConfirm(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                  style={{ background: '#38b6ff' }}>
                  <CheckCircle className="w-4 h-4" /> Enviar Inscrição
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Modal de confirmação final */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#fef3c7', border: '1.5px solid #f59e0b' }}>
                  <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold" style={{ color: '#001b3d' }}>Verifique antes de enviar</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Confirme que todos os seus <strong>dados pessoais, funcionais e documentos</strong> estão corretos.
              </p>
              <ul className="text-sm text-gray-600 space-y-1.5 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <li>• Nome: <strong>{form.nome}</strong></li>
                <li>• CPF: <strong>{form.cpf}</strong></li>
                <li>• Escola: <strong>{form.escola}</strong></li>
                <li>• Cargo: <strong>{form.cargo}</strong></li>
                <li>• Matrícula: <strong>{form.matricula}</strong></li>
              </ul>
              <p className="text-xs text-gray-400">
                Após o envio <strong>não será possível alterar</strong> os dados ou substituir documentos. Certifique-se de que está tudo correto.
              </p>
              {submitError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{submitError}</p>
              )}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Voltar e revisar
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={async () => {
                    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
                    await handleSubmit(syntheticEvent);
                  }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white transition-opacity disabled:opacity-60"
                  style={{ background: '#001b3d' }}
                >
                  {submitting ? 'Enviando…' : 'Confirmar e Enviar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
