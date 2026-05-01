import { useEffect } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Collections from '../components/Collections';
import CustomOrder from '../components/CustomOrder';
import Testimonials from '../components/Testimonials';

export default function Home() {
  useEffect(() => {
    // Re-initialize intersection observer when home mounts
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      });
    }, appearOptions);

    faders.forEach(fader => appearOnScroll.observe(fader));
    return () => faders.forEach(fader => appearOnScroll.unobserve(fader));
  }, []);

  return (
    <main>
      <Hero />
      <About />
      <Collections />
      <CustomOrder />
      <Testimonials />
    </main>
  );
}
