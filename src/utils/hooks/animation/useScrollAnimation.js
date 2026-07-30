// hooks/useScrollAnimation.ts
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useScrollAnimation = (selector, options = {}) => {
  const { from = { y: 80, opacity: 0 }, to = { y: 0, opacity: 1, ease: 'power3.out', duration: 1 }, stagger = 0.15, delay = 0, triggerOnce = true } = options;

  useGSAP(() => {
    const elements = typeof selector === 'string' ? gsap.utils.toArray(selector) : [selector.current];

    if (!elements.length || elements[0] === null) return;

    gsap.fromTo(elements, from, {
      ...to,
      stagger: stagger,
      delay,
      scrollTrigger: {
        trigger: elements[0],
        start: 'top 10%',
        toggleActions: 'play none none reverse',
        once: triggerOnce,
      },
    });
  }, [selector]);
};

export default useScrollAnimation;
