'use client';

import { motion } from 'framer-motion';
import { Shield, FileCheck, Zap, Users } from 'lucide-react';

const cards = [
  {
    icon: Shield,
    title: 'Transparência Total',
    description:
      'Cada etapa do processo avaliativo é registrada com auditoria completa. Todas as ações realizadas no sistema geram logs imutáveis, garantindo rastreabilidade e imparcialidade em todo o processo.',
    color: 'from-blue-600 to-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: FileCheck,
    title: 'Conformidade Legal',
    description:
      'Desenvolvido em estrita conformidade com a LGPD (Lei nº 13.709/2018) e regulamentações municipais de Oriximiná/PA. Proteção de dados pessoais e direitos dos candidatos assegurados em todas as etapas.',
    color: 'from-teal-600 to-teal-500',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
  },
  {
    icon: Zap,
    title: '100% Digital',
    description:
      'Eliminação completa da burocracia em papel. Todo o processo — desde a inscrição até a emissão do certificado — é conduzido de forma online, agilizando prazos e reduzindo custos operacionais.',
    color: 'from-yellow-600 to-yellow-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
  {
    icon: Users,
    title: 'Gestão Centralizada',
    description:
      'A Secretaria Municipal de Educação tem visão e controle total do processo através de um painel administrativo centralizado, com relatórios em tempo real e ferramentas de tomada de decisão.',
    color: 'from-purple-600 to-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function About() {
  return (
    <section id="sobre" className="py-20 lg:py-28 bg-white" style={{ borderTop: '1px solid #e9edf2' }}>
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
            Por que o Meritus?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Uma solução desenvolvida para modernizar e dar transparência ao processo de avaliação e
            certificação de gestores escolares no município de Oriximiná/PA.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={cardVariants}
                className={`relative group rounded-2xl p-6 ${card.bg} border ${card.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default`}
              >
                {/* Icon */}
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 shadow-md"
                  style={{ background: '#001b3d' }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: '#38b6ff' }}
                />
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
