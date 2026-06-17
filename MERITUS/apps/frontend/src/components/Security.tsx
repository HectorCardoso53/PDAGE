'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Database, Eye } from 'lucide-react';

const columns = [
  {
    icon: Lock,
    title: 'Comunicação Segura',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    items: [
      {
        title: 'HTTPS com SSL/TLS',
        description:
          'Todas as comunicações criptografadas com protocolo TLS 1.3, garantindo confidencialidade dos dados em trânsito.',
      },
      {
        title: 'Certificados Let\'s Encrypt',
        description:
          'Certificados SSL gratuitos emitidos pela autoridade certificadora Let\'s Encrypt, reconhecida mundialmente.',
      },
      {
        title: 'Renovação Automática',
        description:
          'Renovação automática dos certificados SSL via Certbot, eliminando risco de expiração e interrupção do serviço.',
      },
    ],
  },
  {
    icon: Database,
    title: 'Proteção de Dados',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    items: [
      {
        title: 'Conformidade LGPD',
        description:
          'Desenvolvido em conformidade com a Lei Geral de Proteção de Dados (nº 13.709/2018), respeitando direitos dos titulares.',
      },
      {
        title: 'Dados Criptografados',
        description:
          'Informações sensíveis dos candidatos armazenadas com criptografia em repouso. Senhas com hash bcrypt.',
      },
      {
        title: 'Controle de Acesso RBAC',
        description:
          'Controle de acesso baseado em funções (Role-Based Access Control) com permissões granulares por perfil de usuário.',
      },
    ],
  },
  {
    icon: Eye,
    title: 'Rastreabilidade',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    items: [
      {
        title: 'Logs Administrativos Completos',
        description:
          'Registro detalhado de todas as ações administrativas: criação, edição e exclusão de registros com timestamp e usuário.',
      },
      {
        title: 'Auditoria de Todas as Ações',
        description:
          'Sistema de auditoria abrangente cobrindo desde login de usuários até alterações em classificações e documentos.',
      },
      {
        title: 'Histórico Imutável',
        description:
          'Logs armazenados de forma imutável, impossibilitando adulteração retroativa do histórico de atividades.',
      },
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

export default function Security() {
  return (
    <section
      id="seguranca"
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{ backgroundColor: '#f4f6f8', borderTop: '1px solid #e9edf2' }}
    >
      {/* Background subtle tint */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-100/40 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-accent-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          {/* Large shield icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-[#001b3d] flex items-center justify-center shadow-glow-blue">
                <Shield className="w-10 h-10 text-white" />
              </div>
              {/* Ring effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-accent-500/30 scale-110 animate-pulse" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4" style={{ color: '#001b3d' }}>
            Segurança e Conformidade
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            O PDAGE foi projetado com segurança em camadas, garantindo proteção dos dados dos
            candidatos e conformidade com todas as legislações vigentes.
          </p>
        </motion.div>

        {/* 3 columns */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {columns.map((col) => {
            const Icon = col.icon;
            return (
              <motion.div
                key={col.title}
                variants={columnVariants}
                className={`rounded-2xl p-6 ${col.bg} border ${col.border}`}
              >
                {/* Column header */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-10 h-10 rounded-xl ${col.bg} border ${col.border} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${col.color}`} />
                  </div>
                  <h3 className={`text-lg font-bold ${col.color}`}>{col.title}</h3>
                </div>

                {/* Items */}
                <div className="space-y-5">
                  {col.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div
                        className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full ${col.bg} border ${col.border} flex items-center justify-center`}
                      >
                        <div className={`w-2 h-2 rounded-full ${col.color.replace('text-', 'bg-')}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* LGPD compliance banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 rounded-2xl bg-primary-50 border border-primary-200 p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#001b3d] flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-1">
              Conformidade total com a Lei Geral de Proteção de Dados — LGPD (Lei nº 13.709/2018)
            </h4>
            <p className="text-gray-600 text-sm">
              Os dados pessoais dos candidatos são tratados com base legal definida, com finalidade
              específica e pelo tempo estritamente necessário para o processo avaliativo.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
