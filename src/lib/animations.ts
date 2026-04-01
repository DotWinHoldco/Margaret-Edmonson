import type { Easing } from 'framer-motion'

const easeOut: Easing = [0.16, 1, 0.3, 1]

export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
}

export const scrollReveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: easeOut },
}

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
}

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export const cardHover = {
  whileHover: { y: -8, transition: { duration: 0.3 } },
  whileTap: { scale: 0.98 },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 },
}

export const slideInLeft = {
  initial: { opacity: 0, x: -60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: easeOut },
}

export const slideInRight = {
  initial: { opacity: 0, x: 60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: easeOut },
}
