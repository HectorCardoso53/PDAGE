'use client';

import { motion } from 'framer-motion';
import { ArrowDown, FileText, ChevronRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: 'easeOut' },
  }),
};

export default function Hero() {
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden bg-white"
      style={{ borderBottom: '1px solid #e0e4ea' }}
    >
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40 w-full text-center">
        {/* Main title */}
        <motion.h1
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
          style={{ color: '#001b3d' }}
        >
          Plataforma Digital de{' '}
          <span style={{ color: '#38b6ff' }}>Avaliação</span>{' '}
          para Gestores Escolares
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-lg leading-relaxed max-w-2xl mx-auto mb-10"
          style={{ color: '#666666' }}
        >
          Sistema oficial para gerenciamento do processo de certificação e avaliação de gestores
          da educação municipal de{' '}
          <span className="font-semibold" style={{ color: '#001b3d' }}>Oriximiná/PA</span>.
          Transparente, seguro e 100% online.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
        >
          <button
            onClick={() => handleScroll('sobre')}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg"
            style={{ background: '#001b3d' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#002654')}
            onMouseLeave={e => (e.currentTarget.style.background = '#001b3d')}
          >
            Conhecer o Sistema
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('processo')}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg"
            style={{ background: '#38b6ff' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#6ccaff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#38b6ff'; }}
          >
            <FileText className="w-4 h-4" />
            Ver Processo
          </button>
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs" style={{ color: '#a8beca' }}>Role para explorar</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-4 h-4" style={{ color: '#a8beca' }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
