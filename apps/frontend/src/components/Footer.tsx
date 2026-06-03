'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

const quickLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Processo', href: '#processo' },
  { label: 'Funcionalidades', href: '#funcionalidades' },
];

const infoLinks = [
  { label: 'Edital', href: '#' },
  { label: 'Documentos Necessários', href: '#' },
  { label: 'Suporte Técnico', href: '#' },
  { label: 'Perguntas Frequentes', href: '#' },
];

export default function Footer() {
  const handleNavClick = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <footer style={{ background: '#001428', borderTop: '3px solid #ffd21f' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14"
        >
          {/* Column 1: Logo + description */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <Image src="/logo.png" alt="Brasão de Oriximiná" width={40} height={40} className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-xl font-bold text-white leading-none block">Meritus</span>
                <span className="text-[11px] text-gray-500 leading-none mt-0.5 block">
                  Gestores Escolares
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Plataforma Digital de Avaliação para Gestores Escolares de Oriximiná-PA.
              Desenvolvida pela Secretaria de Eficiência Governamental - SEMEG, em 
              parceria com Secretaria de Educação - SEMED.
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Info links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Informações
            </h4>
            <ul className="space-y-3">
              {infoLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 group"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contato
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-300 mb-0.5">
                  SEMED — Secretaria de Educação
                </p>
                <p className="text-xs text-gray-500">
                  Desenvolvido pela SEMEG — Secretaria de Eficiência Governamental
                </p>
                <p className="text-sm text-gray-400 mt-1">Prefeitura Municipal de Oriximiná/PA</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">E-mail</p>
                <a
                  href="mailto:semed.pmo@oriximina.pa.gov.br"
                  className="text-sm transition-colors duration-200"
                  style={{ color: '#38b6ff' }}
                >
                  semed.pmo@oriximina.pa.gov.br
                </a>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Município</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Oriximiná — Pará
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Prefeitura Municipal de Oriximiná — SEMED. Desenvolvido pela SEMEG. Todos os
            direitos reservados.
          </p>
          <p className="text-xs text-gray-600">
            Este sistema trata dados pessoais em conformidade com a{' '}
            <span className="text-gray-500 font-medium">LGPD (Lei nº 13.709/2018)</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
