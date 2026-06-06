'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, Users, GraduationCap, ClipboardList, FileText,
  PenLine, BookOpen, School, Trophy, Laptop,
} from 'lucide-react';

const faqCategories = [
  {
    icon: Users,
    title: 'Quem pode participar',
    questions: [
      { q: 'Quem pode se inscrever neste processo seletivo?', a: 'Podem participar os profissionais do magistério efetivos ou temporários da Rede Pública Municipal de Ensino de Oriximiná/PA que desejam se habilitar para as funções de Diretor(a) Educacional, Vice-diretor(a) Educacional das áreas urbana e rural e Coordenador(a) Educacional da área rural.', ref: 'Item 1.1 e 3.1 do Edital' },
      { q: 'Servidor(a) temporário(a) pode participar?', a: 'Sim. O edital admite candidatos com vínculo efetivo, estável e/ou temporário. Atenção: a participação de servidores temporários decorre exclusivamente da condicionalidade do VAAR e não gera direito adquirido, expectativa de direito ou prioridade no provimento dos cargos.', ref: 'Itens 3.1 alínea f e 3.2' },
      { q: 'É necessário estar em exercício ativo para participar?', a: 'Sim. É obrigatório estar em pleno exercício de suas funções no momento da inscrição. Candidatos afastados, licenciados ou inativos não atendem a este requisito.', ref: 'Item 3.1 alínea d' },
      { q: 'Preciso estar lotado na SEMED de Oriximiná?', a: 'Sim. É exigido que o candidato esteja lotado na Secretaria Municipal de Educação de Oriximiná/PA. Profissionais cedidos a outros órgãos ou lotados em outras secretarias não se enquadram.', ref: 'Item 3.1 alínea e' },
      { q: 'Qual o tempo mínimo de serviço exigido?', a: 'O candidato deve comprovar no mínimo 2 (dois) anos de efetivo exercício na docência e/ou gestão escolar, coordenação educacional ou coordenação pedagógica.', ref: 'Item 3.1 alínea h' },
      { q: 'Candidato com processo administrativo disciplinar pode se inscrever?', a: 'Não. É requisito eliminatório não estar cumprindo penalidade decorrente de Processo Administrativo Disciplinar e não ter sofrido condenação transitada em julgado que impeça o exercício de função pública.', ref: 'Item 3.1 alínea i' },
      { q: 'A certificação garante que serei nomeado(a) como diretor(a) ou coordenador(a)?', a: 'Não. A aprovação e certificação não constituem direito subjetivo, expectativa de direito ou garantia de provimento aos cargos. O preenchimento ocorre mediante ato discricionário de livre nomeação e exoneração do Poder Executivo Municipal.', ref: 'Itens 3.2 e 12.8' },
    ],
  },
  {
    icon: GraduationCap,
    title: 'Formação acadêmica e especialização',
    questions: [
      { q: 'Tenho só bacharelado, sem nenhuma licenciatura. Posso me inscrever?', a: 'Não. O edital exige Licenciatura Plena em Pedagogia ou outra Licenciatura Plena, acompanhada de especialização em Gestão Escolar ou área correlata. O bacharelado sozinho, sem licenciatura, não atende ao requisito e é motivo de eliminação automática na Habilitação Documental.', ref: 'Item 3.1 alínea g e 4.2.2' },
      { q: 'Tenho bacharelado e especialização em Gestão Escolar, mas não tenho licenciatura. Posso participar?', a: 'Não. A especialização em Gestão Escolar não substitui a licenciatura. O requisito exige Licenciatura Plena como base obrigatória. Bacharelado + especialização não atende ao edital.', ref: 'Item 3.1 alínea g' },
      { q: 'Tenho Licenciatura Plena em Pedagogia. Preciso ter especialização em Gestão Escolar para participar?', a: 'Não. A Licenciatura Plena em Pedagogia já é suficiente para cumprir o requisito. No entanto, se você tiver especialização, ela conta pontos na Avaliação de Currículo (2ª etapa) — até 1,0 ponto.', ref: 'Itens 3.1 alínea g e 6.1 alínea c' },
      { q: 'Tenho Licenciatura Plena em outra área (não Pedagogia). O que preciso além do diploma?', a: 'Deve apresentar obrigatoriamente o certificado de curso de pós-graduação em Administração ou Gestão Escolar, com carga horária mínima de 360 horas. Sem esse certificado, a inscrição será automaticamente inabilitada.', ref: 'Item 4.2 alíneas g e h' },
      { q: 'Especialização em Coordenação Escolar conta como "área correlata" à Gestão Escolar?', a: 'Depende. O edital menciona "especialização em Gestão Escolar ou área correlata reconhecida pelo Ministério da Educação". A decisão final cabe à Comissão Avaliadora. Em caso de dúvida, consulte a SEMED antes de se inscrever.', ref: 'Item 3.1 alínea g' },
      { q: 'Especialização em Supervisão Escolar ou Orientação Educacional é considerada área correlata?', a: 'Depende. O edital não lista explicitamente quais especializações são correlatas, apenas exige que sejam reconhecidas pelo Ministério da Educação. A aceitação fica a critério da Comissão Avaliadora. Recomenda-se consultar a SEMED antecipadamente.', ref: 'Item 3.1 alínea g' },
      { q: 'Tenho Licenciatura em Pedagogia e especialização em Coordenação Escolar. Devo informar a especialização?', a: 'Sim. Mesmo que a Licenciatura em Pedagogia já garanta sua habilitação, a especialização pontua na Avaliação de Currículo (2ª etapa), valendo até 1,0 ponto. Todo documento que agrega pontuação deve ser incluído.', ref: 'Itens 3.1 alínea g e 6.1 alínea c' },
      { q: 'MBA em Gestão Educacional conta como especialização em área correlata?', a: 'Possivelmente sim. Um MBA reconhecido pelo MEC na área de Gestão Educacional pode ser considerado correlato. Verifique se a instituição e o curso possuem reconhecimento do MEC e consulte a SEMED antes da inscrição.', ref: 'Item 3.1 alínea g' },
      { q: 'Tenho mais de uma especialização. Posso declarar todas?', a: 'Sim. Você pode apresentar todos os diplomas, porém na Avaliação de Currículo é computado apenas 1 (um) diploma de especialização, valendo 1,0 ponto — independentemente da quantidade.', ref: 'Item 6.1 alínea c' },
      { q: 'Diploma de especialização de EAD é aceito?', a: 'Depende. O edital não proíbe diplomas de EAD. O critério é que a instituição e o curso sejam reconhecidos pelo MEC. Especializações EAD de instituições credenciadas pelo MEC são aceitas.', ref: 'Item 3.1 alínea g' },
    ],
  },
  {
    icon: ClipboardList,
    title: 'Inscrição',
    questions: [
      { q: 'Qual é o período de inscrições?', a: 'As inscrições ocorrem de 04 a 08 de junho de 2026, exclusivamente pela plataforma Meritus.', ref: 'Anexo I – Cronograma' },
      { q: 'A inscrição pode ser feita presencialmente?', a: 'Não. As inscrições são realizadas de forma exclusivamente eletrônica pela plataforma Meritus.', ref: 'Item 4.1' },
      { q: 'Posso editar minha inscrição depois de enviada?', a: 'Somente durante o prazo. O sistema permite edição enquanto o período de inscrições estiver aberto (04 a 08/06/2026). Após a confirmação final e encerrado o prazo, os dados ficam bloqueados para alteração.', ref: 'Item 4.1 e Anexo I' },
      { q: 'Posso me inscrever pelo celular?', a: 'Sim. A plataforma funciona em qualquer dispositivo com acesso à internet. Para o envio dos arquivos PDF, recomenda-se usar um computador para facilitar o upload dos documentos.', ref: 'Item 4.1' },
      { q: 'Quando sai o resultado da homologação das inscrições?', a: 'A homologação será publicada em 09 de junho de 2026 na plataforma Meritus, nos canais da SEMED, no site da PMO e no Diário Oficial Municipal.', ref: 'Itens 4.2.1 e Anexo I' },
      { q: 'A inscrição tem taxa?', a: 'Não. O edital não menciona nenhuma taxa. O processo é inteiramente gratuito.', ref: '' },
    ],
  },
  {
    icon: FileText,
    title: 'Documentos exigidos',
    questions: [
      { q: 'Quais documentos são obrigatórios no ato da inscrição?', a: 'Todos em formato PDF, tamanho máximo 20 MB por arquivo: RG ou CNH (frente e verso em um único PDF), CPF, Comprovante de Residência, Título de Eleitor com comprovante de quitação eleitoral, Carteira de Reservista (obrigatório para sexo masculino), Diploma de Licenciatura Plena, Certificado de pós-graduação em Gestão Escolar com mín. 360h (somente para licenciados em outras áreas além de Pedagogia) e Comprovante de Lotação Escolar emitido pelo RH da SEMED.', ref: 'Item 4.2 alíneas a a i' },
      { q: 'Se eu não apresentar algum documento, o que acontece?', a: 'O candidato será automaticamente inabilitado e eliminado do processo.', ref: 'Item 4.2.2' },
      { q: 'Como junto frente e verso do RG em um único PDF?', a: 'Use um app de scanner no celular (Adobe Scan, CamScanner) que salva várias páginas em um único PDF; insira as duas imagens no Word em páginas separadas e salve como PDF; ou use sites gratuitos como ilovepdf.com para combinar dois PDFs em um.', ref: 'Item 4.2 alínea a' },
      { q: 'Como obtenho o comprovante de quitação eleitoral?', a: 'Está disponível gratuitamente no site do Tribunal Regional Eleitoral do Pará (tre-pa.jus.br) ou pelo aplicativo e-Título.', ref: 'Item 4.2 alínea d' },
      { q: 'Onde consigo o Comprovante de Lotação Escolar?', a: 'É emitido pela Coordenação de Recursos Humanos (RH) da Secretaria Municipal de Educação de Oriximiná/PA. Solicite com antecedência, pois pode levar alguns dias.', ref: 'Item 4.2 alínea i' },
      { q: 'Meu diploma de licenciatura ainda não foi emitido. Posso usar a declaração de conclusão?', a: 'O edital exige especificamente o "diploma". O edital não menciona declaração de conclusão como substituta. Recomenda-se consultar a SEMED antes da inscrição para confirmar se será aceita.', ref: 'Item 4.2 alíneas f e g' },
      { q: 'Preciso enviar certificados de cursos de aperfeiçoamento na inscrição?', a: 'Não. Os certificados de cursos são exigidos apenas na 2ª etapa (Avaliação de Currículo), de 22 a 26/07/2026, após aprovação na prova objetiva.', ref: 'Item 6 e Anexo I' },
    ],
  },
  {
    icon: PenLine,
    title: 'Prova objetiva (1ª etapa)',
    questions: [
      { q: 'Quando e onde será a prova objetiva?', a: '08 de julho de 2026, na EMEF Helvécio Guerreiro. Abertura dos portões: 12h30. Fechamento: 13h30 (impreterivelmente). Início da prova: 14h. Término: 17h (horário de Brasília).', ref: 'Itens 5.9 a 5.11 e Anexo I' },
      { q: 'Quantas questões tem a prova e qual é a pontuação?', a: '20 questões de múltipla escolha divididas em 3 níveis: Nível Baixo (5 questões × 3 pts = 15 pts), Nível Médio (5 questões × 5 pts = 25 pts) e Nível Alto (10 questões × 6 pts = 60 pts). Total: 100 pontos.', ref: 'Itens 5.3 a 5.5 e Anexo II' },
      { q: 'Qual é a nota mínima para passar na prova objetiva?', a: 'O candidato precisa acertar 50% das questões, equivalente a 5,0 pontos. Quem não atingir é eliminado do processo.', ref: 'Item 5.6' },
      { q: 'O que preciso levar no dia da prova?', a: 'Documento oficial de identificação com foto, na forma física. Em caso de extravio, perda ou furto, será aceito Boletim de Ocorrência (B.O.) impresso expedido por autoridade policial.', ref: 'Itens 5.12 e 5.13' },
      { q: 'Cheguei após as 13h30. Posso entrar?', a: 'Não. O fechamento dos portões ocorre impreterivelmente às 13h30. Após esse horário, a entrada é vedada sem exceções.', ref: 'Item 5.10' },
      { q: 'Como a prova é corrigida?', a: 'Os candidatos respondem em cartão-resposta preenchido com caneta esferográfica de tinta preta fabricada com material transparente. A correção é feita por QR Code Digital e leitor óptico.', ref: 'Itens 5.7 e 5.8' },
    ],
  },
  {
    icon: BookOpen,
    title: 'Avaliação de currículo (2ª etapa)',
    questions: [
      { q: 'Quando ocorre a Avaliação de Currículo e quem pode participar?', a: 'De 22 a 26 de julho de 2026 (envio dos documentos pela plataforma). Podem participar apenas os candidatos aprovados na prova objetiva.', ref: 'Item 6 e Anexo I' },
      { q: 'Quais documentos são avaliados no currículo e qual a pontuação?', a: 'Formação específica — pós-graduação (máx. 3,0 pts): Doutorado (1,0 pt), Mestrado (1,0 pt), Especialização (1,0 pt). Cursos de aperfeiçoamento 2023–2026 (máx. 7,0 pts): 100 a 200 horas (3,0 pts), 50 a 90 horas (2,0 pts), 10 a 40 horas (2,0 pts).', ref: 'Itens 6.1 e 6.2' },
      { q: 'A Avaliação de Currículo é eliminatória?', a: 'Não. A pontuação é somada às demais etapas para composição da nota final, mas não configura critério eliminatório.', ref: 'Item 6.3' },
      { q: 'Cursos de aperfeiçoamento de que período são aceitos?', a: 'Somente certificados e declarações dos anos de 2023 a 2026. Cursos realizados antes de 2023 não são computados.', ref: 'Itens 3.5 e 6.2' },
      { q: 'Tenho vários certificados de cursos. Todos pontuam?', a: 'Cada faixa de carga horária pontua uma única vez. Apresente os certificados mais vantajosos dentro de cada faixa.', ref: 'Item 6.2' },
    ],
  },
  {
    icon: School,
    title: 'Plano de Gestão Escolar (3ª etapa)',
    questions: [
      { q: 'Quando e como o Plano de Gestão é enviado?', a: 'O upload ocorre de 22 a 26 de julho de 2026, pela plataforma Meritus, junto com os documentos de currículo. Somente candidatos aprovados na prova objetiva participam desta etapa.', ref: 'Item 3.6 e Anexo I' },
      { q: 'Qual é a pontuação e as dimensões avaliadas?', a: 'O Plano vale até 10 pontos totais, com 2,5 pontos por dimensão: Gestão Pedagógica (2,5 pts), Gestão Administrativa (2,5 pts), Gestão Financeira (2,5 pts) e Gestão de Pessoas/RH (2,5 pts).', ref: 'Item 7 e Anexo III' },
      { q: 'O Plano de Gestão é eliminatório?', a: 'Não. A pontuação é somada às demais etapas e não configura critério eliminatório isoladamente.', ref: 'Item 7.1' },
      { q: 'Qual é a estrutura exigida para o Plano de Gestão?', a: 'Conforme o Anexo IV do edital: Identificação do candidato, Etapa da Educação Básica de interesse, Sumário, Justificativa, Objetivo Geral, Plano de Ação por dimensões (Pedagógica, Administrativa, Financeira, Pessoas), Avaliação do Plano e Referências.', ref: 'Anexo IV' },
      { q: 'O Plano de Gestão aprovado me compromete com algo?', a: 'Sim. O Plano aprovado integra os compromissos formais assumidos pelo gestor designado, servindo como instrumento de acompanhamento e avaliação de desempenho durante o mandato.', ref: 'Item 3.7' },
    ],
  },
  {
    icon: Trophy,
    title: 'Resultado, recursos e certificado',
    questions: [
      { q: 'Qual é a nota mínima para ser certificado?', a: 'A média aritmética mínima da soma das três etapas para efeito de certificação é de 6,0 (seis) pontos.', ref: 'Item 10.1' },
      { q: 'Quando sai o resultado final?', a: '14 de agosto de 2026. Será divulgado na plataforma Meritus, site da PMO, Diário Oficial Municipal, canais da SEMED e nos átrios das instituições educacionais do município.', ref: 'Itens 8.2 e Anexo I' },
      { q: 'Posso recorrer se discordar do resultado?', a: 'Sim. Os candidatos têm 3 (três) dias úteis após a publicação do resultado preliminar de cada etapa para interpor recurso, pela plataforma Meritus. Recursos fora do prazo não serão analisados.', ref: 'Itens 9.1 e 12.1' },
      { q: 'Por quanto tempo o certificado é válido?', a: 'O certificado tem validade de 4 (quatro) anos.', ref: 'Item 11.1' },
      { q: 'Como recebo o certificado?', a: 'O candidato aprovado receberá o certificado no prédio da Secretaria Municipal de Educação, em data e horário a serem definidos. O certificado digital também ficará disponível na plataforma Meritus com QR Code de validação.', ref: 'Itens 11.1 e 12.4' },
      { q: 'O certificado pode ser verificado por outras instituições?', a: 'Sim. O certificado é emitido com QR Code de validação e armazenado na plataforma Meritus, podendo ser verificado por qualquer instituição com acesso ao sistema.', ref: '' },
    ],
  },
  {
    icon: Laptop,
    title: 'Plataforma Meritus',
    questions: [
      { q: 'Esqueci minha senha. Como recupero o acesso?', a: 'Utilize a opção de recuperação de senha na tela de login da plataforma, informando o e-mail cadastrado no momento da inscrição.', ref: '' },
      { q: 'Houve problema técnico e não consegui enviar minha inscrição a tempo. O que fazer?', a: 'O edital é explícito: a comissão não se responsabiliza por falhas técnicas no equipamento, no acesso à plataforma ou na conexão de internet. Realize a inscrição o quanto antes dentro do prazo (04 a 08/06/2026).', ref: 'Item 4.2.3' },
      { q: 'Como acompanho o andamento da minha inscrição e das etapas?', a: 'Acesse a Área do Candidato com o e-mail e senha cadastrados. Lá você encontra seu protocolo, o status de cada etapa e as notificações do processo. É responsabilidade do candidato acompanhar ativamente todas as publicações na plataforma.', ref: 'Item 12.6' },
      { q: 'Enviei um documento errado. Posso substituir?', a: 'Somente antes do envio final. Enquanto o período de inscrição estiver aberto e antes de clicar em "Confirmar e Enviar", você pode substituir qualquer arquivo. Após a confirmação definitiva, não é possível alterar ou substituir documentos.', ref: '' },
    ],
  },
];

export default function FAQ() {
  const [openCategory, setOpenCategory] = useState<number | null>(0);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const toggleQuestion = (key: string) => {
    setOpenQuestion(prev => (prev === key ? null : key));
  };

  return (
    <section id="faq" className="px-4 py-20" style={{ background: '#f4f6f8' }}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#38b6ff' }}>Dúvidas</span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2" style={{ color: '#001b3d' }}>
            Perguntas Frequentes
          </h2>
          <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
            57 respostas baseadas no edital oficial do processo seletivo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 rounded-2xl overflow-hidden"
          style={{ background: '#001b3d', border: '3px solid #ffd21f' }}
        >
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#ffd21f' }}>Visão Geral</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Fluxo do Processo Avaliativo</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#a8beca' }}>
              O processo é conduzido em <span className="font-bold text-white">7 etapas sequenciais</span>, cada uma com critérios claros e pontuação transparente. Tudo gerenciado pela plataforma Meritus.
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col gap-4">
          {faqCategories.map((cat, ci) => {
            const Icon = cat.icon;
            const isCatOpen = openCategory === ci;
            return (
              <motion.div
                key={ci}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: ci * 0.04, duration: 0.4 }}
                className="rounded-2xl border overflow-hidden"
                style={{ borderColor: '#e5e7eb' }}
              >
                <button
                  onClick={() => setOpenCategory(isCatOpen ? null : ci)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                  style={{ background: isCatOpen ? '#001b3d' : '#fff' }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0" style={{ color: isCatOpen ? '#ffd21f' : '#001b3d' }} />
                    <span className="font-bold text-sm" style={{ color: isCatOpen ? '#fff' : '#001b3d' }}>
                      {cat.title}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: isCatOpen ? 'rgba(255,210,31,0.2)' : '#f4f6f8', color: isCatOpen ? '#ffd21f' : '#6b7280' }}
                    >
                      {cat.questions.length}
                    </span>
                  </div>
                  <ChevronDown
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                    style={{ color: isCatOpen ? '#ffd21f' : '#6b7280', transform: isCatOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isCatOpen && (
                    <motion.div
                      initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ borderTop: '1px solid #e5e7eb' }}>
                        {cat.questions.map((item, qi) => {
                          const key = `${ci}-${qi}`;
                          const isQOpen = openQuestion === key;
                          return (
                            <div key={qi} style={{ borderBottom: qi < cat.questions.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                              <button
                                onClick={() => toggleQuestion(key)}
                                className="w-full flex items-start justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                              >
                                <span className="text-sm font-medium pr-4" style={{ color: '#111827' }}>{item.q}</span>
                                <ChevronDown
                                  className="w-4 h-4 flex-shrink-0 mt-0.5 transition-transform duration-200"
                                  style={{ color: '#9ca3af', transform: isQOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                />
                              </button>
                              <AnimatePresence initial={false}>
                                {isQOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                                    style={{ overflow: 'hidden' }}
                                  >
                                    <div className="px-5 pb-4">
                                      <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>{item.a}</p>
                                      {item.ref && (
                                        <p className="text-xs mt-2 font-medium" style={{ color: '#38b6ff' }}>{item.ref}</p>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
