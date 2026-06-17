'use client';

import { motion } from 'framer-motion';

const primaryTechs = [
  {
    name: 'Next.js',
    description: 'Framework React para produção',
    detail: 'v14 App Router',
    symbol: 'N',
    color: 'from-gray-800 to-gray-700',
    textColor: 'text-white',
    accentColor: 'border-gray-600',
  },
  {
    name: 'NestJS',
    description: 'Framework Node.js escalável',
    detail: 'API REST + JWT',
    symbol: '🐈',
    color: 'from-red-900 to-red-800',
    textColor: 'text-white',
    accentColor: 'border-red-700',
  },
  {
    name: 'PostgreSQL',
    description: 'Banco de dados relacional robusto',
    detail: 'v16 Alpine',
    symbol: 'PG',
    color: 'from-blue-900 to-blue-800',
    textColor: 'text-white',
    accentColor: 'border-blue-700',
  },
  {
    name: 'Prisma',
    description: 'ORM moderno para Node.js',
    detail: 'Migrations + Types',
    symbol: '△',
    color: 'from-teal-900 to-teal-800',
    textColor: 'text-white',
    accentColor: 'border-teal-700',
  },
  {
    name: 'Docker',
    description: 'Containerização e deploy consistente',
    detail: 'Compose + multi-stage',
    symbol: '🐳',
    color: 'from-sky-900 to-sky-800',
    textColor: 'text-white',
    accentColor: 'border-sky-700',
  },
  {
    name: 'NGINX',
    description: 'Servidor web e proxy reverso',
    detail: 'SSL/TLS + Gzip',
    symbol: 'N',
    color: 'from-green-900 to-green-800',
    textColor: 'text-white',
    accentColor: 'border-green-700',
  },
];

const secondaryTechs = [
  {
    name: 'TypeScript',
    description: 'Tipagem estática em todo o projeto',
    symbol: 'TS',
    color: 'bg-blue-500/10 border-blue-500/30',
    textColor: 'text-blue-400',
  },
  {
    name: 'TailwindCSS',
    description: 'Design system utilitário',
    symbol: 'TW',
    color: 'bg-cyan-500/10 border-cyan-500/30',
    textColor: 'text-cyan-400',
  },
  {
    name: 'Framer Motion',
    description: 'Animações fluidas e performáticas',
    symbol: 'FM',
    color: 'bg-purple-500/10 border-purple-500/30',
    textColor: 'text-purple-400',
  },
  {
    name: "Let's Encrypt",
    description: 'Certificados SSL gratuitos e automáticos',
    symbol: 'LE',
    color: 'bg-green-500/10 border-green-500/30',
    textColor: 'text-green-400',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function TechStack() {
  return (
    <section id="tecnologias" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-primary-600/10 text-primary-600 border border-primary-600/20 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Stack Tecnológico
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Tecnologias Utilizadas
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            O PDAGE é construído sobre tecnologias modernas, confiáveis e amplamente adotadas no
            mercado, garantindo escalabilidade e manutenibilidade a longo prazo.
          </p>
        </motion.div>

        {/* Primary tech cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
        >
          {primaryTechs.map((tech) => (
            <motion.div
              key={tech.name}
              variants={cardVariants}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${tech.color} border ${tech.accentColor} p-6
                         hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-default`}
            >
              {/* Background symbol */}
              <div className="absolute right-4 top-4 text-5xl font-black text-white/5 select-none pointer-events-none">
                {tech.symbol}
              </div>

              {/* Icon badge */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg font-black ${tech.textColor}`}
                >
                  {tech.symbol.length <= 2 ? tech.symbol : '★'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{tech.name}</h3>
                  <span className="text-xs text-white/50 font-medium">{tech.detail}</span>
                </div>
              </div>

              <p className="text-sm text-white/70 leading-relaxed">{tech.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Secondary tech pills */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {secondaryTechs.map((tech) => (
            <motion.div
              key={tech.name}
              variants={cardVariants}
              className={`rounded-xl p-4 border ${tech.color} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-8 h-8 rounded-lg border ${tech.color} flex items-center justify-center text-xs font-bold ${tech.textColor}`}
                >
                  {tech.symbol}
                </div>
                <span className={`font-bold text-sm ${tech.textColor}`}>{tech.name}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{tech.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Architecture note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 rounded-2xl bg-primary-900/5 border border-primary-900/10 p-6 text-center"
        >
          <p className="text-gray-600 text-sm leading-relaxed">
            <span className="font-semibold text-gray-800">Arquitetura monorepo</span> gerenciada com{' '}
            <span className="font-semibold text-primary-600">Turborepo</span> para builds
            incrementais e desenvolvimento eficiente. Deploy via{' '}
            <span className="font-semibold text-primary-600">Docker Compose</span> em servidor
            dedicado com proxy reverso NGINX.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
