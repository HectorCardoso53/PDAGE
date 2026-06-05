'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const navLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Processo', href: '#processo' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const id = href.replace('#', '');
    if (pathname !== '/') {
      router.push(`/${href}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: '#001b3d', borderBottom: '3px solid #ffd21f' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Brasão de Oriximiná — Meritus"
                  width={40}
                  height={40}
                  className="w-9 h-9 lg:w-10 lg:h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-lg lg:text-xl font-bold leading-none tracking-tight text-white">
                  Meritus
                </span>
                <span className="text-[10px] lg:text-xs leading-none mt-0.5 hidden sm:block" style={{ color: '#ffffff' }}>
                  Gestores Escolares
                </span>
              </div>
            </a>

            {/* Desktop Navigation + Mobile Toggle */}
            <div className="flex items-center gap-2">
              <nav className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10"
                  >
                    {link.label}
                  </button>
                ))}
              </nav>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg transition-all duration-200 text-white hover:bg-white/10"
                aria-label="Abrir menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed top-16 left-0 right-0 z-40 lg:hidden overflow-hidden shadow-lg"
            style={{ background: '#001428', borderBottom: '2px solid #ffd21f' }}
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-4 py-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
