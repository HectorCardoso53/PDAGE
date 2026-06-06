'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle, CheckCircle, Clock, Globe, User, Upload,
  CheckSquare, Mail, ChevronRight, Monitor, List,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

const processStages = [
  { num: 1, label: 'Habilitação Documental', desc: 'Verificação dos documentos enviados na inscrição.' },
  { num: 2, label: 'Avaliação Cognitiva', desc: 'Prova de conhecimentos gerais e específicos.' },
  { num: 3, label: 'Qualificação Curricular', desc: 'Análise do currículo e experiências profissionais.' },
  { num: 4, label: 'Plano de Gestão', desc: 'Avaliação do plano de gestão escolar apresentado.' },
  { num: 5, label: 'Resultado Final', desc: 'Publicação do resultado consolidado de todas as etapas.' },
  { num: 6, label: 'Certificação', desc: 'Emissão do certificado aos candidatos aprovados.' },
];

const registrationSteps = [
  { icon: Globe, title: 'Acesse o site', time: '1 min', desc: 'Abra o site do Meritus e clique no botão "Inscreva-se" na página inicial.' },
  { icon: User, title: 'Dados Pessoais', time: '3 min', desc: 'Preencha nome completo, CPF, data de nascimento, e-mail, telefone e endereço.' },
  { icon: Upload, title: 'Dados Funcionais e Documentos', time: '8 min', desc: 'Informe escola, cargo e formação. Faça upload dos documentos exigidos pelo edital em PDF.' },
  { icon: CheckSquare, title: 'Confirmação', time: '3 min', desc: 'Revise todas as informações e envie. Guarde o número de protocolo gerado automaticamente.' },
];

const checklist = [
  'Li o edital completo e estou ciente de todas as regras e prazos',
  'Tenho CPF e data de nascimento em mãos',
  'Preparei os documentos exigidos pelo edital em formato PDF',
  'Tenho acesso à internet e um e-mail válido',
  'Reservei aproximadamente 15 minutos sem interrupções',
];

export default function TutorialPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4" style={{ background: '#001b3d' }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            custom={0} variants={fadeUp} initial="hidden" animate="visible"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight"
          >
            Tutorial de Inscrição
          </motion.h1>

          <motion.p
            custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-lg mb-10"
            style={{ color: '#a8beca' }}
          >
            Veja o passo a passo para realizar sua inscrição com segurança.<br />
            Todo o processo é <span className="text-white font-semibold">100% online</span> e leva em média <span className="text-white font-semibold">15 minutos</span>.
          </motion.p>

          <motion.div
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {[
              { icon: Globe, label: '100% Online' },
              { icon: Clock, label: '~15 minutos' },
              { icon: List, label: '4 etapas' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <Icon className="w-5 h-5" style={{ color: '#ffd21f' }} />
                <span className="text-xs font-medium text-white">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Alerta edital */}
      <section className="px-4 py-10" style={{ background: '#f4f6f8' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="flex gap-4 p-5 rounded-2xl border"
            style={{ background: '#fffbe6', borderColor: '#ffd21f' }}
          >
            <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#b8860b' }} />
            <div>
              <p className="font-bold mb-1" style={{ color: '#7a5c00' }}>Leia o edital antes de se inscrever</p>
              <p className="text-sm leading-relaxed" style={{ color: '#7a5c00' }}>
                O edital contém todas as exigências, prazos e critérios de avaliação.
                A inscrição implica ciência e concordância com todas as regras estabelecidas.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Etapas do processo seletivo */}
      <section className="px-4 py-14">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#38b6ff' }}>Visão Geral</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2" style={{ color: '#001b3d' }}>
              Etapas do Processo Seletivo
            </h2>
            <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
              Após a inscrição, seu processo passa por 6 etapas de avaliação.
            </p>
          </motion.div>

          <div className="flex flex-col gap-3">
            {processStages.map((stage, i) => (
              <motion.div
                key={stage.num}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }}
                className="flex items-start gap-4 p-4 rounded-xl border"
                style={{ borderColor: '#e5e7eb', background: '#fff' }}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: '#001b3d' }}>
                  {stage.num}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#001b3d' }}>{stage.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{stage.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 p-4 rounded-xl text-center text-sm font-medium"
            style={{ background: 'rgba(56,182,255,0.08)', color: '#0077b6', border: '1px solid rgba(56,182,255,0.2)' }}
          >
            <Monitor className="w-4 h-4 inline mr-1.5 mb-0.5" />
            Acompanhe todas as etapas em tempo real pela sua <strong>Área do Candidato</strong>.
          </motion.div>
        </div>
      </section>

      {/* Passo a passo da inscrição */}
      <section className="px-4 py-14" style={{ background: '#f4f6f8' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#38b6ff' }}>Como se inscrever</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2" style={{ color: '#001b3d' }}>
              Passo a Passo da Inscrição
            </h2>
          </motion.div>

          <div className="flex flex-col gap-6">
            {registrationSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  custom={i} variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true }}
                  className="flex gap-5 p-5 rounded-2xl bg-white border"
                  style={{ borderColor: '#e5e7eb' }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#001b3d' }}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold" style={{ color: '#001b3d' }}>
                        <span className="text-xs font-semibold mr-2 px-2 py-0.5 rounded-full" style={{ background: '#f4f6f8', color: '#6b7280' }}>
                          Passo {i + 1}
                        </span>
                        {step.title}
                      </p>
                      <span className="text-xs flex items-center gap-1" style={{ color: '#9ca3af' }}>
                        <Clock className="w-3 h-3" />
                        {step.time}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Área do Candidato */}
      <section className="px-4 py-14">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="rounded-2xl p-8 text-white text-center"
            style={{ background: '#001b3d' }}
          >
            <Monitor className="w-10 h-10 mx-auto mb-4" style={{ color: '#ffd21f' }} />
            <h3 className="text-xl font-bold mb-2">Área do Candidato</h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#a8beca' }}>
              Após a inscrição, acesse sua Área do Candidato com seu CPF e data de nascimento.
              Lá você acompanha o status de cada etapa, vê pontuações e observações da banca avaliadora.
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold"
              style={{ background: '#ffd21f', color: '#001b3d' }}
            >
              Acessar Área do Candidato
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Checklist */}
      <section className="px-4 py-14" style={{ background: '#f4f6f8' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#38b6ff' }}>Antes de começar</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2" style={{ color: '#001b3d' }}>
              Checklist de Preparação
            </h2>
          </motion.div>

          <div className="flex flex-col gap-3">
            {checklist.map((item, i) => (
              <motion.div
                key={i}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }}
                className="flex items-start gap-3 p-4 rounded-xl bg-white border"
                style={{ borderColor: '#e5e7eb' }}
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                <span className="text-sm" style={{ color: '#374151' }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ajuda + CTA final */}
      <section className="px-4 py-14">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="w-full flex gap-4 p-5 rounded-2xl border items-start"
            style={{ borderColor: '#e5e7eb' }}
          >
            <Mail className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#38b6ff' }} />
            <div>
              <p className="font-bold mb-1" style={{ color: '#001b3d' }}>Precisa de ajuda?</p>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                Entre em contato com a equipe da SEMED pelo e-mail institucional.
                Nossa equipe está disponível para auxiliar durante o período de inscrições.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
              Pronto para começar? Realize sua inscrição agora.
            </p>
            <a
              href="/inscricao"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold shadow-lg transition-opacity hover:opacity-90"
              style={{ background: '#ffd21f', color: '#001b3d' }}
            >
              Iniciar Inscrição
              <ChevronRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
