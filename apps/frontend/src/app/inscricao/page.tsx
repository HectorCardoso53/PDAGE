'use client';

'use client';

import { useRef, useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, ChevronLeft, CheckCircle, Upload, User, Briefcase, FileText, Eye, EyeOff } from 'lucide-react';
import { apiFetch } from '@/lib/api';

const ESCOLAS: { nome: string; endereco: string }[] = [
  { nome: 'CRECHE MUNICIPAL PROFESSORA CONSTÂNCIA DOS SANTOS LOPES', endereco: 'R. João Batista de Oliveira, S/N, São Lázaro — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL AMELIA FERRARI', endereco: 'Comunidade Castanhal, S/N, Lago Sapucuá — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL ANA MARIA MILEO VIANA', endereco: 'PA 254 Km 43, Comunidade Novo Horizonte, S/N, Zona Rural — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL ANGELO AUGUSTO DE OLIVEIRA', endereco: 'Lago do Sapucuá, S/N, Comunidade Boa Nova — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL ANTONIO CALDERARO', endereco: 'BR 163 Estrada do BEC Km 48 Murta, S/N' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL BALDOINO MELO', endereco: 'Comunidade Serrinha, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL BOA VISTA', endereco: 'Boa Vista, S/N, Alto Rio Trombetas — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL BOA VISTA II', endereco: 'Oiteiro, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL BOM JESUS', endereco: 'Varre Vento, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL CASINHA FELIZ', endereco: 'Ramal do Balualto, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL CONSTANTINA TEODORO DOS SANTOS', endereco: 'Cachoeira Porteira, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL CORACAO DE JESUS', endereco: 'Rio Cachoeiry, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL DEPUTADO GABRIEL GUERREIRO', endereco: 'Tv. Luiz Inácio Lula da Silva, 1598, Penta — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL FE EM DEUS', endereco: 'Ramal do Babaçu, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL HELVECIO GUERREIRO', endereco: 'Av. Independência, 2867, Santa Terezinha — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL INDIGENA WAI WAI', endereco: 'Aldeia Indígena Wai Wai, S/N, Mapuera — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL JOAO PAULO II', endereco: 'Comunidade Jauary, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL LAURO PICANCO VIANA', endereco: 'Boca dos Currais, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL LUIZ GONZAGA VIANA', endereco: 'Lago do Sapucuá, 0, Comunidade Amapá — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL LUIZ GONZAGA VIANA FILHO', endereco: 'Lago Sapucuá, S/N, Ascensão — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL MACEDONIA', endereco: 'Lago do Sapucuá, S/N, Comunidade Nova Macedônia — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL MANOEL RAMOS DE OLIVEIRA', endereco: 'Lago Maria Pixi, S/N, Espírito Santo — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL MARIA POMPEIA IUDICE DA SILVA', endereco: 'R. Joveniano Ferreira de Barros, 1590, São Pedro — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL NOSSA SENHORA APARECIDA', endereco: 'Boa Vista, S/N, Cuminá — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL NOSSA SENHORA DA PIEDADE', endereco: 'Aracuã de Baixo, S/N, Comunidade Qui. Aracuã de Baixo — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL NOSSA SENHORA DAS GRACAS', endereco: 'Rio Cuminá, S/N, Comunidade Água Fria — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL NOSSA SENHORA DE FATIMA', endereco: 'Bacabal, S/N, Comunidade Bacabal — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL NOSSA SENHORA DE NAZARE', endereco: 'Samaúma, S/N, Samaúma II — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL NOSSA SENHORA DE SANTA ANA', endereco: 'Lago Acapuzinho, S/N, Acapú — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL NOSSA SENHORA DO PERPETUO SOCORRO', endereco: 'Lago do Moura, S/N, Moura — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL NOSSA SENHORA DO ROSARIO', endereco: 'Caipuru de Fora, S/N, Caipuru — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL NOVA ALIANCA', endereco: 'Comunidade Nova Aliança, S/N, Acapú III — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL NOVA BETEL', endereco: 'BR 163 Estrada do BEC Km 12, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL NOVA ESPERANCA (Cidade Nova)', endereco: 'R. Marechal Castelo Branco, 4027, Cidade Nova — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL NOVA ESPERANCA (Erepecu)', endereco: 'Rio Erepecu, S/N, Erepecu — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL NOVO ISRAEL', endereco: 'Lago do Ajudante, S/N, Ajudante — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL NOVO MILENIO', endereco: 'Caipuru, S/N, Batata — Caipuru — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL NOVO PARAISO', endereco: 'Ramal do Poção, S/N, Bom Jesus — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL PEDRO CARLOS DE OLIVEIRA', endereco: 'Ramal do Carapanã, S/N, Carapanã — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL PROF.ª ADELIA FIGUEIRA', endereco: 'R. Dr. Lauro Sodré, 1653, Santa Luzia — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL PROF.ª IRACEMA GIVONI', endereco: 'R. Dom Floriano, S/N, Santíssimo Sacramento — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL PROF.ª JOANA BANDEIRA MONTEIRO', endereco: 'Tv. César Guerreiro, 490, Santa Terezinha — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL PROF.ª MARIA QUEIROZ DE SOUZA', endereco: 'R. Marechal Castelo Branco, S/N, Santa Luzia — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL PROFESSOR ASSUNCAO', endereco: 'R. 15 de Novembro, 2581, Centro — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL RAIMUNDO MUNIZ DE FIGUEIREDO', endereco: 'R. Pedro Carlos de Oliveira, 1603, Santa Luzia — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL RAIMUNDO VIEIRA DOS SANTOS', endereco: 'Tapagem, S/N, Mãe Cué — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SANTA INES', endereco: 'Lago do Flexal, S/N, Flexal — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SANTA LUZIA', endereco: 'Lago Sacuri, S/N, Sacuri — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SANTA MARIA (Erepecu)', endereco: 'Quilombo Erepecu, S/N, Erepecu — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SANTA MARIA (Tapixauã)', endereco: 'Lago Tapixauã, S/N, Tapixauã — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SANTA MARIA GORETTI (Jacupá)', endereco: 'Lago Jacupá, S/N, Jacupá — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SANTA MARIA GORETTI (Santa Terezinha)', endereco: 'R. 7 de Setembro, 2772, Santa Terezinha — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SANTA TEREZINHA (Axipicá)', endereco: 'Lago Axipicá, S/N, Axipicá — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SANTA TEREZINHA (Ajará)', endereco: 'Lago Sapucuá, S/N, Comunidade Ajará — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SANTISSIMA TRINDADE', endereco: 'Rio Erepecuru, S/N, Cachoeira da Pancada — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SANTO ANTONIO (Campos Gerais)', endereco: 'Ramal dos Três — Campos Gerais Km 3, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SANTO ANTONIO (Alambique)', endereco: 'Ramal do Alambique, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SANTO ANTONIO (Xiriri)', endereco: 'Lago Xiriri, S/N, Comunidade Xiriri — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SANTO ANTONIO (Jamari)', endereco: 'Jamari, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SAO DOMINGOS SAVIO', endereco: 'Lago Itapecuru, S/N, Itapecuru — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SAO FRANCISCO', endereco: 'Araçá de Fora, S/N, Araçá — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SAO FRANCISCO DE ASSIS', endereco: 'Comunidade São Francisco de Assis, S/N, Poço Fundo — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SAO FRANCISCO DE CANINDE', endereco: 'Lago Jarauaca, S/N, Jarauaca — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SAO JOAO', endereco: 'Aracuã do Meio, S/N, Varre Vento — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SAO JOAO BATISTA', endereco: 'Lago Caipuru, S/N, Caipuru — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SAO LAZARO (Ananizal)', endereco: 'Ramal do Jatuarana, S/N, Ananizal — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SAO LAZARO (Curupira)', endereco: 'Lago Curupira, S/N, Curupira — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SAO NICOLAU', endereco: 'Comunidade São Nicolau, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SAO PAULO', endereco: 'Comunidade São Paulo Rapa Pau, S/N, Rapa Pau — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SAO SEBASTIAO (Lago Salgado)', endereco: 'Rio Cuminá, S/N, Lago Salgado I — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SAO SEBASTIAO (BEC Km 28)', endereco: 'BR 163 Estrada do BEC Km 28 Tabocal, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SENADOR ALOYSIO DA COSTA CHAVES', endereco: 'R. Marechal Castelo Branco, 3150, Perpétuo Socorro — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SENADOR LAMEIRA BITTENCOURT', endereco: 'R. Barão do Rio Branco, 1830, Nossa Senhora de Fátima — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL TANCREDO NEVES', endereco: 'Comunidade Abuí Grande, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL VITORIA REGIA', endereco: 'Monte Múria, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL BOA ESPERANCA', endereco: 'Tv. João Estumano, S/N, São Pedro — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL CRIANCA ESPERANCA', endereco: 'R. Marechal Castelo Branco, 3882, Cidade Nova — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL HILDA MARIA VIANA DA SILVA', endereco: 'São Francisco — Rio Cuminá, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL LAURA WANDERLEY DINIZ', endereco: 'Tv. Cazuza Guerreiro, S/N, Santa Terezinha — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL FLORINDA GUERREIRO MILEO', endereco: 'Tv. José Gabriel Guerreiro, 1811, Santíssimo — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL MARIA PERPETUA ANDRADE RIBEIRO', endereco: 'Tv. Jonathas Athias, 1918, Nossa Senhora das Graças — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL PLACIDA FARIAS DE BRITO', endereco: 'R. Sete de Setembro, 3860, São José Operário — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL PROF.ª AFONSINA ELINDA ARAGAO DE SOUZA', endereco: 'Tv. João Estumano, 1097, São Pedro — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL PROF.ª AMELIA FERRARI', endereco: 'R. Pedro Carlos de Oliveira, 2020, Centro — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL SANTA ROSA', endereco: 'Tv. Antonio Bentes de Oliveira, 2122, Nossa Senhora das Graças' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL ALTINO BENTES', endereco: 'Ramal do Jatuarana Km 08, S/N — CEP 68270-000' },
  { nome: 'ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL JOAO PAULO I', endereco: 'Tv. Jonathas Pontes Athias, 1248, Nossa Senhora das Graças' },
];

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
  senha: string; confirmarSenha: string;
  cep: string; logradouro: string; numero: string; bairro: string; cidade: string;
  vinculo: string; matricula: string; cargo: string; escola: string; municipio: string;
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

const DRAFT_KEY = 'pdage_inscricao_draft';

type FormDraft = Omit<FormState,
  'docRgCnh'|'docCpf'|'docResidencia'|'docTituloEleitor'|'docQuitacao'|
  'docReservista'|'docDiplomaPedagogia'|'docDiplomaOutras'|'docPosGraduacao'|'docLotacao'|
  'confirmarSenha'
>;

function loadDraft(): { form: FormDraft; step: number } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveDraft(form: FormState, step: number) {
  const draft: FormDraft = {
    nome: form.nome, cpf: form.cpf, rg: form.rg, orgaoEmissor: form.orgaoEmissor,
    dataNasc: form.dataNasc, sexo: form.sexo, estadoCivil: form.estadoCivil,
    telefone: form.telefone, email: form.email, cep: form.cep,
    logradouro: form.logradouro, numero: form.numero, bairro: form.bairro, cidade: form.cidade,
    senha: form.senha,
    vinculo: form.vinculo, matricula: form.matricula, cargo: form.cargo,
    escola: form.escola, municipio: form.municipio, tempoServico: form.tempoServico,
    formacao: form.formacao, especializacao: form.especializacao,
    diplomaTipo: form.diplomaTipo, declaracaoDados: form.declaracaoDados,
  };
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ form: draft, step }));
}

const INITIAL_FORM: FormState = {
  nome: '', cpf: '', rg: '', orgaoEmissor: '', dataNasc: '', sexo: '', estadoCivil: '',
  telefone: '', email: '', senha: '', confirmarSenha: '', cep: '', logradouro: '', numero: '', bairro: '', cidade: '',
  vinculo: '', matricula: '', cargo: '', escola: '', municipio: 'Oriximiná',
  tempoServico: '', formacao: '', especializacao: '',
  docRgCnh: null, docCpf: null, docResidencia: null,
  docTituloEleitor: null, docQuitacao: null, docReservista: null,
  diplomaTipo: '', docDiplomaPedagogia: null, docDiplomaOutras: null,
  docPosGraduacao: null, docLotacao: null,
  declaracaoDados: false,
};

export default function InscricaoPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [protocolo, setProtocolo] = useState('');
  const [fileError, setFileError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [senhaError, setSenhaError] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [bairroOtro, setBairroOtro] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<{ form: FormDraft; step: number } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const renameInputRef = useRef<Map<string, HTMLInputElement | null>>(new Map());

  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  // Detecta rascunho salvo ao montar
  useEffect(() => {
    const draft = loadDraft();
    if (draft && draft.form.nome) {
      setPendingDraft(draft);
      setShowResume(true);
    }
  }, []);

  // Salva rascunho automaticamente a cada mudança (exceto arquivos)
  useEffect(() => {
    if (submitted) return;
    saveDraft(form, step);
  }, [form, step, submitted]);

  const applyDraft = () => {
    if (!pendingDraft) return;
    setForm(f => ({ ...f, ...pendingDraft.form }));
    setStep(pendingDraft.step);
    setShowResume(false);
  };

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setShowResume(false);
    setPendingDraft(null);
  };

  const set = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleFile = (field: keyof FormState, e: React.ChangeEvent<HTMLInputElement>) => {
    set(field, (e.target.files?.[0] ?? null) as FormState[typeof field]);
    setFileError('');
  };

  const handleRename = (field: keyof FormState, newName: string) => {
    const file = form[field] as File | null;
    if (!file || !newName.trim()) return;
    const name = newName.trim().toLowerCase().endsWith('.pdf') ? newName.trim() : newName.trim() + '.pdf';
    set(field, new File([file], name, { type: file.type }) as FormState[typeof field]);
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
    if (form.diplomaTipo === 'outras' && form.especializacao !== 'Não' && !form.docPosGraduacao)
      return 'Envie o Certificado de Pós-graduação em Administração ou Gestão Escolar (item h — obrigatório para licenciados em outras áreas).';
    if (!form.docLotacao) return 'Envie o Comprovante de Lotação Escolar (item i).';
    return '';
  };

  const handleNext = () => {
    if (step === 1) {
      if (formRef.current && !formRef.current.reportValidity()) return;
      if (form.senha.length < 6) { setSenhaError('A senha deve ter pelo menos 6 caracteres.'); return; }
      if (form.senha !== form.confirmarSenha) { setSenhaError('As senhas não coincidem.'); return; }
      setSenhaError('');
    } else if (step === 3) {
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
      fd.append('senha',         form.senha);
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
      if (form.vinculo)   fd.append('vinculo',   form.vinculo);
      if (form.matricula) fd.append('matricula', form.matricula);
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
      localStorage.removeItem(DRAFT_KEY);
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

  const normalizeStr = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

  const FileCard = ({
    field, tag, label, hint, optional,
  }: {
    field: keyof FormState; tag: string; label: string; hint?: string; optional?: boolean;
  }) => {
    const file = form[field] as File | null;
    const nameWithoutExt = file ? file.name.replace(/\.pdf$/i, '') : '';
    const normLabel = normalizeStr(label);
    const normFile  = normalizeStr(nameWithoutExt);
    const nameOk = !file || normFile.length < 2 || normLabel.includes(normFile) || normFile.includes(normLabel);
    const isPdf = !file || file.name.toLowerCase().endsWith('.pdf');

    let borderStyle = optional
      ? 'border-gray-200 hover:border-gray-300 bg-white'
      : 'border-gray-300 hover:border-blue-300 bg-white';
    if (file && isPdf && nameOk) borderStyle = 'border-green-400 bg-green-50';
    if (file && (!isPdf || !nameOk)) borderStyle = 'border-orange-400 bg-orange-50';

    return (
      <div className={`border-2 border-dashed rounded-xl p-4 transition-colors ${borderStyle}`}>
        <div className="flex items-start gap-3">
          <span
            className="flex-shrink-0 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center text-white mt-0.5"
            style={{ background: file && (!isPdf || !nameOk) ? '#ea580c' : optional ? '#6b7280' : '#001b3d' }}
          >{tag}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-700 mb-0.5">
              {label}
              {optional && <span className="ml-1.5 text-xs font-normal text-gray-400">(opcional)</span>}
            </p>
            {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
            <p className="text-xs text-gray-400 mb-2">
              Nomeie o arquivo como: <span className="font-semibold text-gray-600">{label}.pdf</span>
            </p>
            <label
              className="inline-flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium text-white"
              style={{ background: file && (!isPdf || !nameOk) ? '#ea580c' : file ? '#15803d' : '#001b3d' }}
            >
              <Upload className="w-3.5 h-3.5" />
              {file ? 'Trocar arquivo' : 'Selecionar PDF'}
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={e => handleFile(field, e)}
              />
            </label>
            {file && isPdf && nameOk && (
              <p className="text-xs text-green-700 mt-1.5 font-medium truncate">✓ {file.name}</p>
            )}
            {file && !isPdf && (
              <p className="text-xs text-orange-600 mt-1.5 font-medium">
                ⚠ Apenas arquivos PDF são aceitos. Converta o arquivo e tente novamente.
              </p>
            )}
            {file && isPdf && !nameOk && (
              <div className="mt-1.5">
                <p className="text-xs text-orange-600 font-medium mb-1">⚠ Nome incorreto — edite abaixo e clique em OK:</p>
                <div className="flex items-center gap-1">
                  <input
                    key={file.name}
                    ref={el => { renameInputRef.current.set(field as string, el); }}
                    type="text"
                    defaultValue={file.name.replace(/\.pdf$/i, '')}
                    className="text-xs border border-orange-300 rounded-lg px-2 py-1.5 flex-1 focus:outline-none focus:ring-1 focus:ring-orange-400 bg-white"
                    placeholder={label}
                  />
                  <span className="text-xs text-gray-400 font-medium">.pdf</span>
                  <button
                    type="button"
                    onClick={() => {
                      const el = renameInputRef.current.get(field as string);
                      if (el) handleRename(field, el.value);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white flex-shrink-0"
                    style={{ background: '#001b3d' }}
                  >
                    OK
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Sugestão: <span className="font-semibold text-gray-600">{label}.pdf</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />

      {/* Modal: retomar rascunho */}
      {showResume && pendingDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#f0f7ff' }}>
              <FileText className="w-7 h-7" style={{ color: '#001b3d' }} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#001b3d' }}>Rascunho encontrado</h3>
            <p className="text-sm text-gray-500 mb-1">
              Você começou uma inscrição anteriormente como:
            </p>
            <p className="font-semibold text-gray-800 mb-1">{pendingDraft.form.nome || '—'}</p>
            <p className="text-xs text-gray-400 mb-6">Etapa {pendingDraft.step} de 4 — deseja continuar de onde parou?</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={applyDraft}
                className="w-full py-3 rounded-xl font-bold text-sm"
                style={{ background: '#001b3d', color: '#ffd21f' }}
              >
                Continuar de onde parei
              </button>
              <button
                onClick={discardDraft}
                className="w-full py-2.5 rounded-xl font-medium text-sm border border-gray-200 text-gray-500 hover:bg-gray-50"
              >
                Começar do zero
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen pt-20 pb-16" style={{ backgroundColor: '#f4f6f8' }}>

        {/* Page header */}
        <div className="py-10 text-center" style={{ background: '#001b3d' }}>
          <h1 className="text-3xl font-bold text-white mb-1">Inscrição — Processo Seletivo</h1>
          <p className="text-sm mb-4" style={{ color: '#38b6ff' }}>Meritus · Gestores Escolares · Oriximiná/PA</p>
          <a
            href="https://oriximina.1dom.com.br/edicao/01KT6S1ASXH6V93ZBZ83RZ77EK"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: '#ffd21f', color: '#001b3d' }}
          >
            <FileText className="w-4 h-4" />
            Ler o Edital antes de se inscrever
          </a>
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
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (step < 4) handleNext(); } }}
          className="max-w-3xl mx-auto px-4"
          noValidate
        >
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
                <div className={fieldsetClass}>
                  <div>
                    <label className={labelClass}>Senha de acesso *</label>
                    <div className="relative">
                      <input
                        required
                        type={showSenha ? 'text' : 'password'}
                        className={inputClass + ' pr-10'}
                        value={form.senha}
                        onChange={e => { set('senha', e.target.value); setSenhaError(''); }}
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                      />
                      <button type="button" tabIndex={-1}
                        onClick={() => setShowSenha(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Confirmar senha *</label>
                    <div className="relative">
                      <input
                        required
                        type={showConfirmarSenha ? 'text' : 'password'}
                        className={inputClass + ' pr-10'}
                        value={form.confirmarSenha}
                        onChange={e => { set('confirmarSenha', e.target.value); setSenhaError(''); }}
                        placeholder="Repita a senha"
                      />
                      <button type="button" tabIndex={-1}
                        onClick={() => setShowConfirmarSenha(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirmarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                {senhaError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                    {senhaError}
                  </p>
                )}

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
                      <select
                        required={!bairroOtro}
                        className={inputClass}
                        value={bairroOtro ? 'Outro' : form.bairro}
                        onChange={e => {
                          if (e.target.value === 'Outro') {
                            setBairroOtro(true);
                            set('bairro', '');
                          } else {
                            setBairroOtro(false);
                            set('bairro', e.target.value);
                          }
                        }}
                      >
                        <option value="">Selecione...</option>
                        {['CENTRO','NOSSA SENHORA DE FÁTIMA','SANTA LUZIA','SÃO PEDRO','NOSSA SENHORA DAS GRAÇAS','PENTA','PENTA 2','NOVO HORIZONTE','BELA VISTA','SÃO LÁZARO','JESUS MISERICORDIOSO','SANTÍSSIMO SACRAMENTO','ÁREA PASTORAL','SÃO FRANCISCO','PARAISÓPOLIS','PERPÉTUO SOCORRO','CIDADE NOVA','SÃO JOSÉ OPERÁRIO','SÃO JOSÉ OPERÁRIO 2'].map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                        <option value="Outro">Outro</option>
                      </select>
                      {bairroOtro && (
                        <input
                          required
                          className={inputClass + ' mt-2'}
                          placeholder="Digite o nome do bairro"
                          value={form.bairro}
                          onChange={e => set('bairro', e.target.value)}
                        />
                      )}
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
                    <label className={labelClass}>Tipo de Vínculo *</label>
                    <select
                      required
                      className={inputClass}
                      value={form.vinculo}
                      onChange={e => {
                        set('vinculo', e.target.value);
                        if (e.target.value === 'Temporário') set('matricula', '');
                      }}
                    >
                      <option value="">Selecione...</option>
                      <option value="Efetivo">Efetivo</option>
                      <option value="Contratado">Contratado</option>
                      <option value="Temporário">Temporário</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Cargo Atual *</label>
                    <input required className={inputClass} value={form.cargo} onChange={e => set('cargo', e.target.value)} placeholder="Ex: Professor(a)" />
                  </div>
                </div>
                {(form.vinculo === 'Efetivo' || form.vinculo === 'Contratado') && (
                  <div>
                    <label className={labelClass}>Matrícula Funcional *</label>
                    <input required inputMode="numeric" className={inputClass} value={form.matricula} onChange={e => set('matricula', mask.numeric(e.target.value))} placeholder="Nº de matrícula" maxLength={20} />
                  </div>
                )}
                <div className="relative">
                  <label className={labelClass}>Escola / Unidade de Ensino *</label>
                  <input
                    required
                    autoComplete="off"
                    className={inputClass}
                    value={form.escola}
                    onChange={e => { set('escola', e.target.value); }}
                    onFocus={() => { if (!form.escola) set('escola', ''); }}
                    placeholder="Digite para buscar a escola..."
                  />
                  {(() => {
                    const q = form.escola.trim().toLowerCase();
                    const matches = q.length >= 2
                      ? ESCOLAS.filter(e => e.nome.toLowerCase().includes(q) && e.nome !== form.escola)
                      : [];
                    if (!matches.length) return null;
                    return (
                      <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto text-sm">
                        {matches.map(escola => (
                          <li
                            key={escola.nome}
                            onMouseDown={e => { e.preventDefault(); set('escola', escola.nome); }}
                            className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-0"
                          >
                            <p className="font-medium text-gray-800 leading-snug">{escola.nome}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{escola.endereco}</p>
                          </li>
                        ))}
                      </ul>
                    );
                  })()}
                </div>
                <div>
                  <label className={labelClass}>Tempo de Serviço na Educação *</label>
                  <select required className={inputClass} value={form.tempoServico} onChange={e => set('tempoServico', e.target.value)}>
                    <option value="">Selecione</option>
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
                  Envie todos os documentos em <strong>PDF</strong>. Nomeie cada arquivo conforme indicado no campo. Tamanho máximo: 5 MB por arquivo.
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
                      {form.especializacao !== 'Não' && (
                        <FileCard
                          field="docPosGraduacao"
                          tag="h"
                          label="Certificado de Pós-graduação em Administração ou Gestão Escolar"
                          hint="Carga horária mínima de 360 horas"
                          optional
                        />
                      )}
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
                      {form.especializacao !== 'Não' && (
                        <FileCard
                          field="docPosGraduacao"
                          tag="h"
                          label="Certificado de Pós-graduação em Administração ou Gestão Escolar"
                          hint="Carga horária mínima de 360 horas — obrigatório para licenciados em outras áreas"
                        />
                      )}
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
                    <span className="text-gray-400">Vínculo</span><span className="font-medium">{form.vinculo}</span>
                    {form.vinculo !== 'Temporário' && <><span className="text-gray-400">Matrícula</span><span className="font-medium">{form.matricula}</span></>}
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
                      ...(form.diplomaTipo === 'pedagogia' ? [{ label: 'Diploma de Licenciatura Plena em Pedagogia', file: form.docDiplomaPedagogia }] : []),
                      ...(form.diplomaTipo === 'outras' ? [{ label: 'Diploma de Licenciatura Plena em outras áreas', file: form.docDiplomaOutras }] : []),
                      ...(form.especializacao !== 'Não' ? [{ label: 'Certificado de Pós-graduação em Administração ou Gestão Escolar', file: form.docPosGraduacao }] : []),
                      { label: 'Comprovante de Lotação Escolar', file: form.docLotacao },
                    ].map(({ label, file }) => {
                      const nameWithoutExt = file ? file.name.replace(/\.pdf$/i, '') : '';
                      const normLabel = normalizeStr(label);
                      const normFile  = normalizeStr(nameWithoutExt);
                      const nameOk = !file || normFile.length < 2 || normLabel.includes(normFile) || normFile.includes(normLabel);
                      const isPdf = !file || file.name.toLowerCase().endsWith('.pdf');
                      const hasWarning = file && (!isPdf || !nameOk);

                      return (
                        <li key={label} className={`rounded-lg px-3 py-2 ${hasWarning ? 'bg-orange-50 border border-orange-200' : 'flex items-center gap-2'}`}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`w-4 h-4 flex-shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${hasWarning ? 'bg-orange-400 text-white' : file ? 'bg-green-500 text-white' : 'bg-red-400 text-white'}`}>
                              {hasWarning ? '!' : file ? '✓' : '✗'}
                            </span>
                            <span className={hasWarning ? 'text-orange-700 font-medium' : file ? 'text-gray-700' : 'text-red-500'}>{label}</span>
                            {file && (
                              <button
                                type="button"
                                onClick={() => window.open(URL.createObjectURL(file))}
                                className={`inline-flex items-center gap-1 text-xs hover:underline truncate max-w-[220px] ${hasWarning ? 'text-orange-500 hover:text-orange-700' : 'text-blue-500 hover:text-blue-700'}`}
                                title="Visualizar documento"
                              >
                                <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                                {file.name}
                              </button>
                            )}
                          </div>
                          {file && !isPdf && (
                            <p className="text-xs text-orange-600 mt-1 ml-6">⚠ Apenas PDF é aceito — converta o arquivo.</p>
                          )}
                          {file && isPdf && !nameOk && (
                            <p className="text-xs text-orange-600 mt-1 ml-6">⚠ Renomeie para <strong>{label}.pdf</strong> antes de enviar.</p>
                          )}
                        </li>
                      );
                    })}
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
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: '#f0f7ff', border: '1.5px solid #38b6ff' }}>
                  <img src="/logo.png" alt="Prefeitura" className="w-8 h-8 object-contain" />
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
                {form.vinculo !== 'Temporário' && <li>• Matrícula: <strong>{form.matricula}</strong></li>}
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
