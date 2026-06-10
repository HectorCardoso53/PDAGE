'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: 'easeOut' },
  }),
};

export default function Hero() {
  const prazoEncerrado = new Date() > new Date('2026-06-10T02:59:59Z');

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ borderBottom: '1px solid #e0e4ea' }}
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Gestao.png"
          alt=""
          fill
          className="object-cover object-[70%] sm:object-center"
          priority
        />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.70)' }} />
      </div>

      <div className="relative z-10 max-w-xl px-4 sm:px-6 lg:px-8 py-32 lg:py-40 text-left ml-8 lg:ml-24">
        {/* Main title */}
        <motion.h1
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
          style={{ color: '#ffffff' }}
        >
          <span className="block text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-2" style={{ color: '#38b6ff' }}>Meritus</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-medium">Plataforma Digital para Avaliação de Mérito e Desempenho</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-lg leading-relaxed max-w-2xl mb-10"
          style={{ color: '#e0e0e0' }}
        >
          Sistema oficial que vai gerenciar o processo de certificação e avaliação de gestores
          da educação municipal de{' '}
          <span className="font-semibold" style={{ color: '#ffffff' }}>Oriximiná/PA</span>.
          Transparente, seguro e 100% online.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-3"
        >
          {prazoEncerrado ? (
            <span
              className="flex items-center justify-center px-7 py-3.5 rounded-md text-sm font-bold cursor-not-allowed opacity-50"
              style={{ background: '#9ca3af', color: '#fff' }}
            >
              Inscrições encerradas
            </span>
          ) : (
            <a
              href="/inscricao"
              className="flex items-center justify-center px-7 py-3.5 rounded-md text-sm font-bold shadow-md transition-opacity hover:opacity-90"
              style={{ background: '#ffd21f', color: '#001b3d' }}
            >
              Inscreva-se
            </a>
          )}
          <a
            href="/login"
            className="flex items-center justify-center px-7 py-3.5 rounded-md text-sm font-medium text-white border border-white/30 hover:border-white/60 transition-all"
          >
            Já inscrito? Entre aqui
          </a>
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
