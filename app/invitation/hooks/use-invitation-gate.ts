'use client'

import { useCallback, useState } from 'react'
import { OPEN_ENVELOPE_MS } from '../constants'

type UseInvitationGateParams = {
  prefersReducedMotion: boolean
  onAfterOpened: () => void
}

export const useInvitationGate = ({
  prefersReducedMotion,
  onAfterOpened,
}: UseInvitationGateParams) => {
  const [isOpened, setIsOpened] = useState(false)
  const [isOpening, setIsOpening] = useState(false)

  const requestOpen = useCallback(() => {
    if (isOpened || isOpening) return

    setIsOpening(true)

    const delay = prefersReducedMotion ? 50 : OPEN_ENVELOPE_MS
    window.setTimeout(() => {
      setIsOpened(true)
      setIsOpening(false)

      queueMicrotask(() => {
        const start = document.getElementById('invite-start')
        if (start) {
          start.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start',
          })
          return
        }

        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      })

      onAfterOpened()
    }, delay)
  }, [isOpened, isOpening, prefersReducedMotion, onAfterOpened])

  return { isOpened, isOpening, requestOpen }
}
