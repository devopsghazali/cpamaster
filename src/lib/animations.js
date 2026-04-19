const PREMIUM_EASE = [0.22, 1, 0.36, 1]
const CINEMATIC_EASE = [0.16, 1, 0.3, 1]

export const ease = {
  premium: PREMIUM_EASE,
  cinematic: CINEMATIC_EASE,
}

export const viewportOnce = { once: true, amount: 0.15, margin: '0px 0px -10% 0px' }
export const viewportLoose = { once: true, amount: 0.1, margin: '0px 0px -5% 0px' }

export const fadeRise = {
  hidden: { opacity: 0, y: 36, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: PREMIUM_EASE },
  },
}

export const fadeRiseSmall = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: PREMIUM_EASE },
  },
}

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: PREMIUM_EASE } },
}

export const fadeScale = {
  hidden: { opacity: 0, y: 24, scale: 0.97, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: PREMIUM_EASE },
  },
}

export const sectionGroup = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

export const listGroup = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
}

export const cardItem = {
  hidden: { opacity: 0, y: 28, scale: 0.97, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: PREMIUM_EASE },
  },
}

export const sectionReveal = {
  initial: 'hidden',
  whileInView: 'show',
  viewport: viewportOnce,
  variants: fadeRise,
}

export const sectionStagger = {
  initial: 'hidden',
  whileInView: 'show',
  viewport: viewportOnce,
  variants: sectionGroup,
}

export const pageEnter = {
  initial: { opacity: 0, y: -48, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: CINEMATIC_EASE },
  },
  exit: {
    opacity: 0,
    y: -24,
    filter: 'blur(6px)',
    transition: { duration: 0.4, ease: PREMIUM_EASE },
  },
}
