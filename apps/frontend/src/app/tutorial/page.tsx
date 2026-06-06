'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, CheckCircle, Globe, User, Briefcase,
  FileText, Monitor, ChevronRight, Award,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const tabs = [
  { id: 1, label: 'Visão Geral' },
  { id: 2, label: 'Acessar o site' },
  { id: 3, label: 'Dados Pessoais' },
  { id: 4, label: 'Dados Funcionais' },
  { id: 5, label: 'Documentos' },
  { id: 6, label: 'Confirmação' },
  { id: 7, label: 'Área do Candidato' },
  { id: 8, label: 'Checklist Final' },
];

const processStages = [
  { num: 1, label: 'Inscrição', badge: 'Fase atual', desc: 'Cadastro online exclusivamente pela plataforma Meritus, de 04 a 08/06/2026.', highlight: true },
  { num: 2, label: 'Análise Documental', desc: 'A comissão avaliadora analisa e valida os documentos enviados na inscrição.' },
  { num: 3, label: 'Avaliação Objetiva', desc: 'Prova de conhecimentos gerais e específicos realizada presencialmente.' },
  { num: 4, label: 'Qualificação Curricular', desc: 'Pontuação calculada automaticamente pelo sistema com base no currículo informado.' },
  { num: 5, label: 'Plano de Gestão', desc: 'Plano de gestão escolar avaliado pela banca examinadora.' },
  { num: 6, label: 'Resultado Final', desc: 'Resultado publicado em ranking por pontuação total acumulada.' },
  { num: 7, label: 'Certificação Digital', desc: 'Emissão do certificado digital aos candidatos aprovados. Acompanhe tudo pela Área do Candidato.' },
];

function EditalAlert() {
  return (
    <div className="flex gap-4 p-5 rounded-2xl border mb-8" style={{ background: '#fffbe6', borderColor: '#ffd21f' }}>
      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#b8860b' }} />
      <div>
        <p className="font-bold text-sm mb-1" style={{ color: '#7a5c00' }}>Leia o edital antes de se inscrever</p>
        <p className="text-sm leading-relaxed" style={{ color: '#7a5c00' }}>
          O edital contém todas as exigências, prazos e critérios de avaliação. A inscrição implica ciência e concordância com todas as regras estabelecidas.
        </p>
      </div>
    </div>
  );
}

function SectionTitle({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#38b6ff' }}>{label}</span>
      <h2 className="text-2xl font-bold mt-1" style={{ color: '#001b3d' }}>{title}</h2>
      {sub && <p className="text-sm mt-1" style={{ color: '#6b7280' }}>{sub}</p>}
    </div>
  );
}

function Step({ num, title, children }: { num: number; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 p-5 rounded-2xl border bg-white" style={{ borderColor: '#e5e7eb' }}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: '#001b3d' }}>
        {num}
      </div>
      <div>
        <p className="font-bold text-sm mb-1" style={{ color: '#001b3d' }}>{title}</p>
        <div className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>{children}</div>
      </div>
    </div>
  );
}

function FieldGrid({ fields }: { fields: string[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {fields.map(f => (
        <div key={f} className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-white" style={{ borderColor: '#e5e7eb' }}>
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#ffd21f' }} />
          <span className="text-sm" style={{ color: '#374151' }}>{f}</span>
        </div>
      ))}
    </div>
  );
}

function DocItem({ title, sub, conditional }: { title: string; sub?: string; conditional?: boolean }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border bg-white" style={{ borderColor: '#e5e7eb' }}>
      <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#001b3d' }} />
      <div className="flex-1">
        <p className="text-sm font-semibold" style={{ color: '#001b3d' }}>{title}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{sub}</p>}
      </div>
      {conditional && (
        <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ background: '#e0f2fe', color: '#0077b6' }}>
          Condicional
        </span>
      )}
    </div>
  );
}

function TabVisaoGeral() {
  return (
    <div>
      <EditalAlert />
      <SectionTitle
        label="Visão Geral"
        title="Etapas do Processo Seletivo"
        sub="O processo é conduzido em 7 etapas sequenciais, cada uma com critérios claros e pontuação transparente. Tudo gerenciado pela plataforma Meritus."
      />
      <div className="flex flex-col gap-3 mb-8">
        {processStages.map(s => (
          <div
            key={s.num}
            className="flex items-start gap-4 p-4 rounded-xl border"
            style={{ borderColor: s.highlight ? '#ffd21f' : '#e5e7eb', background: s.highlight ? '#fffbe6' : '#fff' }}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: '#001b3d' }}>
              {s.num}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className="font-semibold text-sm" style={{ color: '#001b3d' }}>{s.label}</p>
                {s.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: '#dcfce7', color: '#16a34a' }}>
                    {s.badge}
                  </span>
                )}
              </div>
              <p className="text-xs" style={{ color: '#6b7280' }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 p-5 rounded-2xl" style={{ background: '#001b3d' }}>
        <Monitor className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ffd21f' }} />
        <p className="text-sm leading-relaxed" style={{ color: '#a8beca' }}>
          <span className="text-white font-bold">Acompanhe tudo pela Área do Candidato.</span> Após a inscrição, você terá acesso a um painel completo com o status de cada etapa em tempo real.
        </p>
      </div>
    </div>
  );
}

function TabAcessarSite() {
  return (
    <div>
      <SectionTitle label="Passo 1" title="Como acessar o site" sub="Siga estas etapas para chegar à tela de inscrição." />
      <div className="flex flex-col gap-4 mb-8">
        <Step num={1} title="Abra a página do Meritus">
          Acesse o site oficial da plataforma. Funciona em <strong>computador ou celular</strong> — qualquer dispositivo com acesso à internet.
        </Step>
        <Step num={2} title="Leia o edital antes de prosseguir">
          O edital contém as regras, requisitos e prazos do processo. Leia-o na íntegra antes de iniciar a inscrição.
        </Step>
        <Step num={3} title='Clique no botão amarelo "Inscreva-se"'>
          Na página inicial, clique no botão amarelo <strong>"Inscreva-se"</strong> para criar seu cadastro.
          Se já iniciou a inscrição anteriormente, clique em <strong>"Já inscrito? Entre aqui"</strong> para continuar.
        </Step>
      </div>
      <div className="flex gap-4 p-5 rounded-2xl border" style={{ borderColor: '#e5e7eb', background: '#f4f6f8' }}>
        <Globe className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#38b6ff' }} />
        <p className="text-sm" style={{ color: '#4b5563' }}>
          A plataforma funciona em qualquer navegador atualizado (Chrome, Firefox, Safari, Edge). Para o envio dos documentos PDF, recomenda-se usar o computador para facilitar o upload.
        </p>
      </div>
    </div>
  );
}

function TabDadosPessoais() {
  return (
    <div>
      <SectionTitle label="Passo 2" title="Dados Pessoais" sub="Preencha seus dados com atenção. Estas informações serão usadas na análise da inscrição." />
      <FieldGrid fields={[
        'Nome completo',
        'CPF',
        'Data de nascimento',
        'Sexo',
        'E-mail',
        'Telefone / celular',
        'CEP',
        'Rua e número',
        'Bairro',
        'Município e UF',
      ]} />
      <div className="mt-6 flex gap-4 p-5 rounded-2xl border" style={{ borderColor: '#ffd21f', background: '#fffbe6' }}>
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#b8860b' }} />
        <p className="text-sm" style={{ color: '#7a5c00' }}>
          O <strong>CPF</strong> é seu identificador único no sistema — não pode ser alterado após o envio. Confira se está correto antes de avançar.
        </p>
      </div>
    </div>
  );
}

function TabDadosFuncionais() {
  return (
    <div>
      <SectionTitle label="Passo 3" title="Dados Funcionais" sub="Informe seus dados profissionais e de formação acadêmica." />
      <FieldGrid fields={[
        'Nome da escola em que está lotado',
        'Cargo atual',
        'Tipo de vínculo (efetivo / temporário)',
        'Tempo de serviço na docência ou gestão',
        'Formação acadêmica (Licenciatura)',
        'Especialização / Pós-graduação',
      ]} />
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex gap-4 p-4 rounded-xl border" style={{ borderColor: '#e5e7eb', background: '#f4f6f8' }}>
          <Briefcase className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#001b3d' }} />
          <p className="text-sm" style={{ color: '#4b5563' }}>
            Candidatos com <strong>Licenciatura em área diferente de Pedagogia</strong> devem informar a especialização em Gestão Escolar (mín. 360h) e enviar o certificado como documento adicional.
          </p>
        </div>
        <div className="flex gap-4 p-4 rounded-xl border" style={{ borderColor: '#e5e7eb', background: '#f4f6f8' }}>
          <User className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#001b3d' }} />
          <p className="text-sm" style={{ color: '#4b5563' }}>
            O <strong>Comprovante de Lotação Escolar</strong> deve ser solicitado com antecedência ao RH da SEMED — pode levar alguns dias para ser emitido.
          </p>
        </div>
      </div>
    </div>
  );
}

function TabDocumentos() {
  return (
    <div>
      <SectionTitle label="Passo 4" title="Documentos Exigidos" sub="Todos os arquivos devem estar em formato PDF, com tamanho máximo de 20 MB por arquivo." />
      <div className="flex flex-col gap-3 mb-6">
        <DocItem title="RG ou CNH (frente e verso)" sub="Frente e verso em um único arquivo PDF." />
        <DocItem title="CPF" sub="Documento do CPF em PDF." />
        <DocItem title="Comprovante de Residência" sub="Emitido nos últimos 3 meses." />
        <DocItem title="Título de Eleitor + Quitação Eleitoral" sub="Disponível em tre-pa.jus.br ou pelo aplicativo e-Título." />
        <DocItem title="Carteira de Reservista" sub="Obrigatório apenas para candidatos do sexo masculino." conditional />
        <DocItem title="Diploma de Licenciatura Plena" sub="Diploma ou certificado de conclusão reconhecido pelo MEC." />
        <DocItem title="Certificado de Pós-graduação em Gestão Escolar" sub="Mínimo 360h. Exigido apenas para licenciados em áreas que não sejam Pedagogia." conditional />
        <DocItem title="Comprovante de Lotação Escolar" sub="Emitido pelo RH da Secretaria Municipal de Educação (SEMED)." />
      </div>
      <div className="flex gap-4 p-5 rounded-2xl border" style={{ borderColor: '#e5e7eb', background: '#f4f6f8' }}>
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#38b6ff' }} />
        <p className="text-sm" style={{ color: '#4b5563' }}>
          Documentos faltantes ou fora do padrão resultam em <strong>eliminação automática</strong> do processo na etapa de Análise Documental. Confira todos antes de enviar.
        </p>
      </div>
    </div>
  );
}

function TabConfirmacao() {
  return (
    <div>
      <SectionTitle label="Passo 5" title="Confirmação da Inscrição" sub="Antes de enviar, revise todas as informações com atenção." />
      <div className="flex flex-col gap-4 mb-8">
        <Step num={1} title="Revise seus dados pessoais e funcionais">
          Confira nome, CPF, e-mail, escola e formação. Após o envio final, os dados ficam bloqueados para alteração.
        </Step>
        <Step num={2} title="Verifique os documentos enviados">
          Certifique-se de que todos os arquivos PDF estão legíveis e dentro do limite de 20 MB cada.
        </Step>
        <Step num={3} title='Clique em "Enviar Inscrição"'>
          Ao confirmar, sua inscrição é registrada no sistema e um número de protocolo é gerado automaticamente.
        </Step>
        <Step num={4} title="Guarde o número de protocolo">
          O protocolo comprova que sua inscrição foi realizada. Anote ou tire print da tela de confirmação.
        </Step>
      </div>
      <div className="flex gap-4 p-5 rounded-2xl" style={{ background: '#001b3d' }}>
        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ffd21f' }} />
        <p className="text-sm leading-relaxed" style={{ color: '#a8beca' }}>
          <span className="text-white font-bold">Inscrição enviada?</span> Acesse sua Área do Candidato a qualquer momento para acompanhar o andamento de cada etapa do processo.
        </p>
      </div>
    </div>
  );
}

function TabAreaCandidato() {
  return (
    <div>
      <SectionTitle label="Área do Candidato" title="Acompanhe tudo em tempo real" sub="Após a inscrição, acesse seu painel personalizado com e-mail e senha cadastrados." />
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex gap-4 p-5 rounded-2xl border bg-white" style={{ borderColor: '#e5e7eb' }}>
          <Monitor className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#001b3d' }} />
          <div>
            <p className="font-bold text-sm mb-3" style={{ color: '#001b3d' }}>O que você encontra na Área do Candidato</p>
            <ul className="text-sm space-y-2" style={{ color: '#4b5563' }}>
              {[
                'Status de cada etapa (Pendente, Em análise, Aprovado, Reprovado)',
                'Pontuações por etapa',
                'Observações da comissão avaliadora',
                'Número de protocolo da inscrição',
                'Dados completos da sua inscrição',
              ].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#22c55e' }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex gap-4 p-4 rounded-xl border" style={{ borderColor: '#e5e7eb', background: '#f4f6f8' }}>
          <User className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#38b6ff' }} />
          <p className="text-sm" style={{ color: '#4b5563' }}>
            Acesse com o <strong>e-mail e senha</strong> cadastrados na inscrição. Caso esqueça a senha, use a opção <strong>"Esqueci minha senha"</strong> na tela de login.
          </p>
        </div>
      </div>
      <div className="text-center">
        <a
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
          style={{ background: '#001b3d', color: '#fff' }}
        >
          Acessar Área do Candidato
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

function TabChecklist() {
  const items = [
    { text: 'Li o edital completo e estou ciente de todas as regras e prazos', cond: false },
    { text: 'Atendo a todos os requisitos: vínculo ativo, lotação na SEMED, formação exigida e tempo de serviço', cond: false },
    { text: 'Tenho meu CPF, e-mail válido e data de nascimento em mãos', cond: false },
    { text: 'RG ou CNH — frente e verso em um único PDF', cond: false },
    { text: 'CPF em PDF', cond: false },
    { text: 'Comprovante de residência em PDF (últimos 3 meses)', cond: false },
    { text: 'Título de eleitor + comprovante de quitação eleitoral em PDF', cond: false },
    { text: 'Carteira de reservista em PDF (sexo masculino)', cond: true },
    { text: 'Diploma de licenciatura plena em PDF', cond: false },
    { text: 'Certificado de pós-graduação em Gestão Escolar (mín. 360h) em PDF — para não-Pedagogia', cond: true },
    { text: 'Comprovante de Lotação Escolar emitido pelo RH da SEMED em PDF', cond: false },
    { text: 'Reservei aproximadamente 15 minutos sem interrupções para preencher a inscrição', cond: false },
  ];

  return (
    <div>
      <SectionTitle label="Checklist" title="Pronto para se inscrever?" sub="Confirme que você tem tudo antes de iniciar." />
      <div className="flex flex-col gap-3 mb-10">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border" style={{ borderColor: '#e5e7eb' }}>
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
            <span className="text-sm flex-1" style={{ color: '#374151' }}>{item.text}</span>
            {item.cond && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ background: '#e0f2fe', color: '#0077b6' }}>
                Se aplicável
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="text-center p-8 rounded-2xl" style={{ background: '#001b3d' }}>
        <Award className="w-10 h-10 mx-auto mb-4" style={{ color: '#ffd21f' }} />
        <h3 className="text-xl font-bold text-white mb-2">Tudo pronto?</h3>
        <p className="text-sm mb-6" style={{ color: '#a8beca' }}>
          Você está preparado para realizar sua inscrição. Boa sorte!
        </p>
        <a
          href="/inscricao"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-base font-bold transition-opacity hover:opacity-90"
          style={{ background: '#ffd21f', color: '#001b3d' }}
        >
          Iniciar Inscrição
          <ChevronRight className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}

export default function TutorialPage() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-10 px-4" style={{ background: '#001b3d' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold text-white mb-3"
          >
            Tutorial de Inscrição
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-sm mb-8" style={{ color: '#a8beca' }}
          >
            Guia completo para realizar sua inscrição com segurança no processo seletivo Meritus.
          </motion.p>
          <motion.a
            href="https://www.instagram.com/reel/DZOCQJOSCfR/?igsh=bWYwZjF4a3Zpc2Uw"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-md font-bold text-sm transition-opacity hover:opacity-90"
            style={{ background: '#ffd21f', color: '#001b3d' }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            Ver vídeo explicativo no Instagram
          </motion.a>
        </div>
      </section>

      {/* Sticky Tab Bar */}
      <div className="sticky top-16 lg:top-20 z-40 bg-white shadow-sm border-b overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex lg:justify-center gap-1 py-2 px-4">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition-all"
                  style={{
                    background: isActive ? '#001b3d' : 'transparent',
                    color: isActive ? '#fff' : '#6b7280',
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{
                      background: isActive ? '#ffd21f' : '#f3f4f6',
                      color: isActive ? '#001b3d' : '#9ca3af',
                    }}
                  >
                    {tab.id}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-4 py-10" style={{ background: '#f4f6f8' }}>
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 1 && <TabVisaoGeral />}
              {activeTab === 2 && <TabAcessarSite />}
              {activeTab === 3 && <TabDadosPessoais />}
              {activeTab === 4 && <TabDadosFuncionais />}
              {activeTab === 5 && <TabDocumentos />}
              {activeTab === 6 && <TabConfirmacao />}
              {activeTab === 7 && <TabAreaCandidato />}
              {activeTab === 8 && <TabChecklist />}
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: '#e5e7eb' }}>
            <button
              onClick={() => setActiveTab(t => Math.max(1, t - 1))}
              disabled={activeTab === 1}
              className="px-5 py-2 rounded-md text-sm font-medium border bg-white transition-opacity disabled:opacity-30"
              style={{ borderColor: '#e5e7eb', color: '#001b3d' }}
            >
              ← Anterior
            </button>
            {activeTab < 8 ? (
              <button
                onClick={() => setActiveTab(t => Math.min(8, t + 1))}
                className="px-5 py-2 rounded-md text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: '#001b3d' }}
              >
                Próximo →
              </button>
            ) : (
              <a
                href="/inscricao"
                className="px-5 py-2 rounded-md text-sm font-bold transition-opacity hover:opacity-90"
                style={{ background: '#ffd21f', color: '#001b3d' }}
              >
                Iniciar Inscrição →
              </a>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
