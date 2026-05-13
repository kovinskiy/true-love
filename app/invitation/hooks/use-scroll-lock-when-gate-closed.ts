'use client'

import { useEffect } from 'react'

/** Пока приглашение «закрыто» конвертом — фиксируем скролл документа */
export const useScrollLockWhenGateClosed = (isGateOpened: boolean) => {
  useEffect(() => {
    if (typeof document === 'undefined') return

    if (isGateOpened) {
      document.documentElement.style.overflow = ''
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [isGateOpened])
}
