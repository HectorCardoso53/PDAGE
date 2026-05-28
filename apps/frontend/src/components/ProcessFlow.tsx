'use client';

import { motion } from 'framer-motion';
import {
  UserPlus,
  FileText,
  Brain,
  GraduationCap,
  ClipboardList,
  BarChart,
  Award,
} from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Cadastro e Inscrição',
    description:
      'O candidato realiza sua inscrição online com preenchimento de dados pessoais, profissionais e funcionais. O sistema valida automaticamente informações e emite protocolo de inscrição.',
    color: 'from-blue-600 to-blue-500',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
  },
  {
    number: '02',
    icon: FileText,
    title: 'Habilitação Documental',
    description:
      'Envio digital de documentos comprobatórios conforme exigências do edital. O sistema verifica autenticidade, formato e prazo de validade dos documentos submetidos.',
    color: 'from-teal-600 to-teal-500',
    bgLight: 'bg-teal-50',
    textColor: 'text-teal-600',
    borderColor: 'border-teal-200',
  },
  {
    number: '03',
    icon: Brain,
    title: 'Avaliação Cognitiva',
    description:
      'Prova objetiva aplicada de forma online sobre gestão escolar, legislação educacional, LDB, BNCC e normas municipais. Correção automática com resultado imediato.',
    color: 'from-violet-600 to-violet-500',
    bgLight: 'bg-violet-50',
    textColor: 'text-violet-600',
    borderColor: 'border-violet-200',
  },
  {
    number: '04',
    icon: GraduationCap,
    title: 'Qualificação Curricular',
    description:
      'Análise automática do currículo e da experiência profissional do candidato. O sistema pontua formação acadêmica, especializações, tempo de serviço e capacitações.',
    color: 'from-orange-600 to-orange-500',
    bgLight: 'bg-orange-50',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-200',
  },
  {
    number: '05',
    icon: ClipboardList,
    title: 'Plano de Gestão',
    description:
      'Apresentação e avaliação do projeto de gestão escolar elaborado pelo candidato. A banca avaliadora analisa pertinência, viabilidade e alinhamento com as diretrizes municipais.',
    color: 'from-rose-600 to-rose-500',
    bgLight: 'bg-rose-50',
    textColor: 'text-rose-600',
    borderColor: 'border-rose-200',
  },
  {
    number: '06',
    icon: BarChart,
    title: 'Resultado Final',
    description:
      'Classificação automática com pontuação consolidada de todas as etapas. O ranking é gerado de forma transparente com critérios objetivos e publicado no sistema.',
    color: 'from-cyan-600 to-cyan-500',
    bgLight: 'bg-cyan-50',
    textColor: 'text-cyan-600',
    borderColor: 'border-cyan-200',
  },
  {
    number: '07',
    icon: Award,
    title: 'Certificação',
    description:
      'Emissão digital de certificado para gestores habilitados com QR Code de validação. O certificado é armazenado no sistema e pode ser verificado por qualquer instituição.',
    color: 'from-emerald-600 to-emerald-500',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function ProcessFlow() {
  return (
    <section id="processo" className="py-20 lg:py-28" style={{ backgroundColor: '#f4f6f8', borderTop: '1px solid #e9edf2' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4" style={{ color: '#001b3d' }}>
            Fluxo do Processo Avaliativo
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            O processo é conduzido em 7 etapas sequenciais, cada uma com critérios claros e
            pontuação transparente. Tudo gerenciado pela plataforma PDAGE.
          </p>
        </motion.div>

        {/* Desktop: Horizontal connector + Vertical cards */}
        <div className="relative">
          {/* Mobile: vertical timeline */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col gap-0 lg:hidden"
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={stepVariants}
                  className="relative flex gap-4"
                >
                  {/* Left: number + line */}
                  <div className="flex flex-col items-center">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md z-10"
                      style={{ background: '#001b3d' }}
                    >
                      {step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-200 my-2 min-h-[2rem]" />
                    )}
                  </div>

                  {/* Right: content */}
                  <div className={`pb-8 flex-1`}>
                    <div
                      className={`rounded-xl p-5 ${step.bgLight} border ${step.borderColor} hover:shadow-md transition-shadow duration-200`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: '#001b3d' }}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-base">{step.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Desktop: grid layout */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="hidden lg:grid lg:grid-cols-7 gap-4"
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={stepVariants}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-10 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 bg-gray-200 z-0" />
                  )}

                  {/* Number badge */}
                  <div
                    className="relative z-10 w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200 mb-4"
                    style={{ background: '#001b3d' }}
                  >
                    <Icon className="w-7 h-7 text-white mb-0.5" />
                    <span className="text-[10px] text-white/80 font-semibold">{step.number}</span>
                  </div>

                  {/* Content */}
                  <div className={`rounded-xl p-4 ${step.bgLight} border ${step.borderColor} w-full`}>
                    <h3 className={`font-bold text-sm mb-2 ${step.textColor}`}>{step.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-400">
            Cada etapa possui prazo definido pelo edital. O candidato é notificado automaticamente
            sobre prazos e resultados.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
