import CurrencyConverterSection from '@/components/converter/currencyConverter';
import { About } from './aboutUs';
import { Features } from './features';
import Hero from './hero';
import { Newsletter } from './newsletter';

export default function ClientHome() {
  return (
    <>
      <Hero />
      <CurrencyConverterSection />
      <Features />
      <About />
      <Newsletter />
    </>
  );
}
