'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MUSIC_STORAGE_KEY } from '../constants'

export const useWeddingMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isMusicEnabled, setIsMusicEnabled] = useState(true)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [isMusicAvailable, setIsMusicAvailable] = useState(true)

  useEffect(() => {
    const storedMusic =
      typeof window === 'undefined'
        ? null
        : window.localStorage.getItem(MUSIC_STORAGE_KEY)

    if (storedMusic === '0') queueMicrotask(() => setIsMusicEnabled(false))
  }, [])

  const playWithVolume = useCallback(
    (volume: number) => {
      if (!isMusicEnabled) return

      const audio = audioRef.current
      if (!audio) return

      audio.volume = volume
      const playPromise = audio.play()
      if (!playPromise) return

      playPromise
        .then(() => setIsMusicPlaying(true))
        .catch(() => setIsMusicPlaying(false))
    },
    [isMusicEnabled]
  )

  const tryPlay = useCallback(() => {
    playWithVolume(1)
  }, [playWithVolume])

  const primeMusic = useCallback(() => {
    playWithVolume(0)
  }, [playWithVolume])

  const fadeInMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !isMusicEnabled) return

    const playPromise = audio.play()
    if (!playPromise) return

    playPromise
      .then(() => {
        setIsMusicPlaying(true)

        const step = () => {
          audio.volume = Math.min(audio.volume + 0.08, 1)

          if (audio.volume < 1) window.setTimeout(step, 70)
        }

        step()
      })
      .catch(() => setIsMusicPlaying(false))
  }, [isMusicEnabled])

  const toggleMusic = useCallback(() => {
    const nextValue = !isMusicEnabled
    setIsMusicEnabled(nextValue)
    window.localStorage.setItem(MUSIC_STORAGE_KEY, nextValue ? '1' : '0')

    const audio = audioRef.current
    if (!audio) return

    if (!nextValue) {
      audio.pause()
      setIsMusicPlaying(false)
      return
    }

    audio.volume = 1
    const playPromise = audio.play()
    if (!playPromise) return

    playPromise
      .then(() => setIsMusicPlaying(true))
      .catch(() => setIsMusicPlaying(false))
  }, [isMusicEnabled])

  const handleAudioError = useCallback(() => {
    setIsMusicAvailable(false)
    setIsMusicEnabled(false)
    setIsMusicPlaying(false)
    window.localStorage.setItem(MUSIC_STORAGE_KEY, '0')
  }, [])

  const musicLabel = isMusicEnabled ? 'Выключить' : 'Включить'

  return {
    audioRef,
    isMusicEnabled,
    isMusicPlaying,
    isMusicAvailable,
    musicLabel,
    primeMusic,
    fadeInMusic,
    tryPlay,
    toggleMusic,
    handleAudioError,
  }
}
