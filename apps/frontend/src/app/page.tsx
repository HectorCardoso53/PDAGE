import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import ProcessFlow from '@/components/ProcessFlow';
import Security from '@/components/Security';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <About />
      <ProcessFlow />
      <Security />
      <Footer />
    </main>
  );
}
