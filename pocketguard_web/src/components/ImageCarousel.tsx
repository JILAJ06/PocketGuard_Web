'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const slides = [
  {
    src: '/app-screenshot.jpg',
    alt: 'Vista general de la aplicacion PocketGuard',
  },
  {
    src: '/app-slide-balance.svg',
    alt: 'Panel de saldo real gastado',
  },
  {
    src: '/app-slide-alerts.svg',
    alt: 'Vista de alertas de suscripciones',
  },
];

const AUTOPLAY_MS = 3200;

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="relative w-full h-full bg-white">
      {slides.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={index === 0}
          sizes="300px"
          className={`object-cover transition-opacity duration-700 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {slides.map((slide, index) => (
          <span
            key={slide.alt}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              index === currentIndex ? 'w-6 bg-white' : 'w-2.5 bg-white/50'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
