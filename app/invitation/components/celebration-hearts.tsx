'use client'

import { useMemo } from 'react'
import { motion } from 'motion/react'

const HEART_ICONS = ['❤️', '💕', '🤍', '💗', '💖', '✨'] as const

/** Детерминированное «случайное» 0–1 от индекса (без Math.random при рендере) */
const unitFromSeed = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

type CelebrationHeartsProps = {
  prefersReducedMotion: boolean
}

export const CelebrationHearts = ({
  prefersReducedMotion,
}: CelebrationHeartsProps) => {
  const particles = useMemo(() => {
    const count = prefersReducedMotion ? 8 : 26
    return Array.from({ length: count }, (_, index) => {
      const s = index + 1
      const u1 = unitFromSeed(s * 7)
      const u2 = unitFromSeed(s * 13)
      const u3 = unitFromSeed(s * 19)
      const u4 = unitFromSeed(s * 23)
      const u5 = unitFromSeed(s * 29)

      return {
        id: index,
        leftPct: 5 + u1 * 90,
        delay: u2 * 0.5,
        duration: prefersReducedMotion ? 0.6 : 2.5 + u3 * 1.6,
        icon: HEART_ICONS[index % HEART_ICONS.length],
        scale: 0.5 + u4 * 0.7,
        driftX: (u5 - 0.5) * 90,
        spin: prefersReducedMotion ? 0 : (unitFromSeed(s * 31) - 0.5) * 50,
      }
    })
  }, [prefersReducedMotion])

  const travelY = prefersReducedMotion ? '-38vh' : '-130vh'

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bottom-[-6%] -translate-x-1/2"
          style={{ left: `${particle.leftPct}%` }}
        >
          <motion.span
            className="block select-none text-xl sm:text-2xl md:text-3xl"
            initial={{
              y: 0,
              opacity: 0,
              rotate: 0,
              scale: particle.scale * 0.35,
            }}
            animate={{
              y: travelY,
              x: particle.driftX,
              opacity: prefersReducedMotion ? [0, 0.9, 0] : [0, 1, 1, 0],
              rotate: particle.spin,
              scale: particle.scale,
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: [0.22, 0.61, 0.36, 1],
              opacity: {
                duration: particle.duration,
                delay: particle.delay,
                times: prefersReducedMotion ? [0, 0.18, 1] : [0, 0.05, 0.78, 1],
              },
            }}
          >
            {particle.icon}
          </motion.span>
        </div>
      ))}
    </div>
  )
}
