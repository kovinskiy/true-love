'use client'

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export const RevealOnScroll = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setVisible(true)
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={['inv-reveal', visible ? 'inv-reveal--visible' : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
