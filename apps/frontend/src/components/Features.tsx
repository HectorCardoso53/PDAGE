'use client';

import { motion } from 'framer-motion';
import {
  Upload,
  LayoutDashboard,
  Settings,
  Calculator,
  MessageSquare,
  FileOutput,
  BarChart2,
  Shield,
} from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: 'Upload Documental',
    description:
      'Envio seguro de documentos com validação automática de formato, tamanho e integridade. Suporte a PDF, imagens e múltiplos arquivos simultaneamente.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: LayoutDashboard,
    title: 'Painel do Candidato',
    description:
      'Acompanhamento em tempo real de cada etapa do processo, visualização de documentos enviados, pontuações parciais e notificações de prazos.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
  },
  {
    icon: Settings,
    title: 'Painel Administrativo',
    description:
      'Gestão completa do processo pela secretaria de educação: configuração de etapas, gerenciamento de candidatos, validação de documentos e controle de prazos.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: Calculator,
    title: 'Classificação Automática',
    description:
      'Algoritmo de pontuação e ranking totalmente transparente. Critérios definidos no edital aplicados automaticamente, eliminando subjetividade humana.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
  {
    icon: MessageSquare,
    title: 'Gestão de Recursos',
    description:
      'Sistema de recursos e contestações online com prazos controlados. Candidatos podem interpor recursos com justificativas e acompanhar o andamento.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
  },
  {
    icon: FileOutput,
    title: 'Emissão de Certificados',
    description:
      'Certificados digitais com QR Code de validação emitidos automaticamente para gestores habilitados. Verificação instantânea de autenticidade por qualquer instituição.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: BarChart2,
    title: 'Relatórios e Analytics',
    description:
      'Dashboards completos com métricas do processo para tomada de decisão pela secretaria: taxa de aprovação, distribuição de pontuações, status por etapa.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: Shield,
    title: 'Auditoria Completa',
    description:
      'Logs detalhados e imutáveis de todas as ações no sistema. Rastreabilidade completa: quem fez o quê, quando e de qual endereço IP.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function Features() {
  return (
    <section id="funcionalidades" className="py-20 lg:py-28 bg-white" style={{ borderTop: '1px solid #e9edf2' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4" style={{ color: '#001b3d' }}>
            Funcionalidades do Sistema
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Em desenvolvimento para as próximas fases. Um conjunto completo de ferramentas para
            gestão eficiente do processo avaliativo.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className={`relative group rounded-xl p-5 bg-white border ${feature.border}
                           hover:shadow-lg hover:-translate-y-0.5
                           transition-all duration-300 cursor-default`}
              >
                {/* Em breve badge */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-medium bg-gray-100 border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                    Em breve
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${feature.bg} border ${feature.border} mb-4`}
                >
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>

                {/* Bottom glow on hover */}
                <div
                  className={`absolute bottom-0 left-4 right-4 h-px ${feature.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 text-sm">
            O sistema está em desenvolvimento ativo. As funcionalidades serão liberadas
            progressivamente conforme o cronograma do projeto.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
