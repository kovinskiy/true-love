'use client'

import { useMemo } from 'react'
import { VENUE } from './invitation/constants'
import { EnvelopeGate } from './invitation/components/envelope-gate'
import { InvitationBody } from './invitation/components/invitation-body'
import { useInvitationGate } from './invitation/hooks/use-invitation-gate'
import { usePrefersReducedMotion } from './invitation/hooks/use-prefers-reduced-motion'
import { useScrollLockWhenGateClosed } from './invitation/hooks/use-scroll-lock-when-gate-closed'
import { useWeddingMusic } from './invitation/hooks/use-wedding-music'

export default function InvitationPage() {
  const prefersReducedMotion = usePrefersReducedMotion()

  const {
    audioRef,
    isMusicEnabled,
    isMusicPlaying,
    isMusicAvailable,
    musicLabel,
    primeMusic,
    fadeInMusic,
    toggleMusic,
    handleAudioError,
  } = useWeddingMusic()

  const { isOpened, isOpening, requestOpen } = useInvitationGate({
    prefersReducedMotion,
    onAfterOpened: fadeInMusic,
  })

  useScrollLockWhenGateClosed(isOpened)

  const mapHref = useMemo(() => {
    const query = encodeURIComponent(VENUE.mapQuery)
    return `https://yandex.ru/maps/?text=${query}`
  }, [])

  const handleRequestOpen = () => {
    primeMusic()
    requestOpen()
  }

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden">
      <audio
        ref={audioRef}
        src="/Blyadaval_-_Pisipopkikakashechki_80191459.mp3"
        preload="auto"
        loop
        onError={handleAudioError}
      />

      <EnvelopeGate
        isOpen={isOpened}
        isOpening={isOpening}
        onRequestOpen={handleRequestOpen}
      />

      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,#fffdf8_0%,#f4efe6_42%,#ebe4d6_100%)]"
        aria-hidden="true"
      />

      <InvitationBody
        mapHref={mapHref}
        musicLabel={musicLabel}
        isMusicEnabled={isMusicEnabled}
        isMusicPlaying={isMusicPlaying}
        isMusicAvailable={isMusicAvailable}
        onToggleMusic={toggleMusic}
      />
    </main>
  )
}
