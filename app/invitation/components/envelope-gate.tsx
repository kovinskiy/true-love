'use client'

import { type KeyboardEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { COUPLE_TITLE, EVENT_DATE_LABEL } from '../constants'

export const EnvelopeGate = ({
  isOpen,
  isOpening,
  onRequestOpen,
}: {
  isOpen: boolean
  isOpening: boolean
  onRequestOpen: () => void
}) => {
  const reduced = useReducedMotion()
  const isRevealed = isOpening || isOpen

  const transition = reduced
    ? { duration: 0.01 }
    : { duration: 1.15, ease: [0.33, 1, 0.68, 1] as const }

  const flapTransition = reduced
    ? { duration: 0.01 }
    : { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }

  const handleKeyDownEnvelope = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onRequestOpen()
  }

  return (
    <div
      className={[
        'fixed inset-0 z-50 overflow-hidden bg-[#bfc0bd] transition-all duration-700',
        isOpen ? 'pointer-events-none opacity-0' : 'opacity-100',
      ].join(' ')}
      aria-hidden={isOpen}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(236,206,206,0.6),rgba(191,192,189,0)_36%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0)_42%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[18%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#a9aaa6]/35 to-transparent" />

      <div className="absolute inset-x-6 top-[13vh] text-center text-white">
        <p className="text-xs uppercase tracking-[0.48em] opacity-80 sm:text-sm">
          свадебное приглашение
        </p>
        <p className="mt-4 text-4xl text-center leading-none tracking-[0.08em] sm:text-6xl">
          {COUPLE_TITLE}
        </p>
        <p className="mt-4 text-xl opacity-85 sm:text-2xl">{EVENT_DATE_LABEL}</p>
      </div>

      <div
        className="invite-envelope-stage"
        role="button"
        tabIndex={0}
        aria-label="Открыть приглашение"
        onClick={onRequestOpen}
        onKeyDown={handleKeyDownEnvelope}
      >
        <motion.div
          className={[
            'invite-envelope-open',
            isOpening ? 'invite-envelope-open--opening' : '',
            isOpen ? 'invite-envelope-open--opened' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          initial={false}
          animate={{
            y: isRevealed ? -96 : 0,
            opacity: isRevealed ? 0 : 1,
            scale: isRevealed ? 1.05 : 1,
          }}
          transition={transition}
        >
          <div className="invite-envelope-shadow" aria-hidden="true" />
          <div className="invite-envelope-back" aria-hidden="true" />
          <motion.div
            className="invite-envelope-card"
            initial={false}
            animate={{ y: isRevealed ? -120 : 0 }}
            transition={transition}
          >
            <p>Вы приглашены</p>
            <strong>НА СВАДЬБУ</strong>
            <span aria-hidden="true">♡</span>
          </motion.div>
          <motion.div
            className="invite-envelope-flap"
            initial={false}
            animate={{
              y: 0,
              scaleY: isRevealed ? -1 : 1,
            }}
            transition={flapTransition}
            aria-hidden="true"
          />
          <div className="invite-envelope-letter">
            <p>Нажмите, чтобы открыть</p>
          </div>
          <div className="invite-envelope-side invite-envelope-side--left" aria-hidden="true" />
          <div className="invite-envelope-side invite-envelope-side--right" aria-hidden="true" />
          <div className="invite-envelope-pocket" aria-hidden="true" />
          <div className="invite-envelope-seal" aria-hidden="true">♡</div>
        </motion.div>
      </div>
    </div>
  )
}
