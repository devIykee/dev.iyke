import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PortfolioCore from './components/PortfolioCore';
import Toolkit from './components/Toolkit';
import Collaborations from './components/Collaborations';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <PortfolioCore />
      <Toolkit />
      <Collaborations />
      <Footer />
    </main>
  );
}
