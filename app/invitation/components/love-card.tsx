import type { ReactNode } from 'react'

export const LoveCard = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => (
  <div
    className={[
      'rounded-2xl border border-[#e2d8c8] bg-white/90 px-6 py-6 shadow-[0_12px_40px_rgba(62,52,38,0.06)]',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {children}
  </div>
)
