import type { ReactNode } from 'react'

export const LoveH2 = ({
  kicker,
  children,
}: {
  kicker?: string
  children: ReactNode
}) => (
  <div className="text-center">
    {kicker ? (
      <p className="text-[0.68rem] uppercase tracking-[0.42em] text-[#8a7f6a]">
        {kicker}
      </p>
    ) : null}
    <h2 className="mt-2 text-2xl font-normal tracking-[0.06em] text-[#2c261c] sm:text-3xl">
      {children}
    </h2>
  </div>
)
