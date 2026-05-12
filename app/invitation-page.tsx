'use client'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

/** Подставьте свои данные — структура как на invitelove.ru/love_is */
const COUPLE_TITLE = 'TRUE LOVE'

const EVENT_DATE = {
  day: '25',
  month: '09',
  year: '26',
} as const

const EVENT_DATE_LABEL = `${EVENT_DATE.day}.${EVENT_DATE.month}.20${EVENT_DATE.year}`

const VENUE = {
  name: 'Horse Village',
  lines: [
    'Ростовская область, Азовский район,',
    'Обильненское сельское поселение',
  ],
  mapQuery:
    'Horse Village Ростовская область, Азовский район, Обильненское сельское поселение',
} as const

const OPEN_ENVELOPE_MS = 1400
const PRELOADER_MS = 1450

const MUSIC_STORAGE_KEY = 'true-love:music-enabled'

const schedule = [
  { time: '15:30', title: 'Фуршет' },
  { time: '16:00', title: 'Церемония' },
  { time: '17:00', title: 'Свадебный ужин' },
  { time: '21:45', title: 'Торт' },
  { time: '23:00', title: 'Завершение' },
]

const drinks = [
  'Белое вино',
  'Красное вино',
  'Шампанское',
  'Водка',
  'Коньяк',
  'Не пью алкоголь',
]

const dressCodeForLadies = ['бежевые', 'пастельные оттенки']
const dressCodeForMen = ['черный низ', 'белая рубашка']

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setReduced(media.matches)

    handleChange()
    media.addEventListener('change', handleChange)

    return () => media.removeEventListener('change', handleChange)
  }, [])

  return reduced
}

const RevealOnScroll = ({
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

const Preloader = ({ done }: { done: boolean }) => (
  <div
    className={['uc-preloader', done ? 'uc-preloader--done' : ''].join(' ')}
    aria-live="polite"
    aria-busy={!done}
  >
    <div className="px-6 text-center">
      <p className="uc-preloader__title">Love is</p>
      <p className="uc-preloader__sub">приглашение</p>
      <div className="uc-preloader__heart" aria-hidden="true">
        🤍
      </div>
    </div>
  </div>
)

const EnvelopeGate = ({
  isOpen,
  isOpening,
  onRequestOpen,
}: {
  isOpen: boolean
  isOpening: boolean
  onRequestOpen: () => void
}) => {
  const envelopeClass = [
    'inv-envelope',
    isOpening || isOpen ? 'inv-envelope--opening' : '',
    isOpen ? 'inv-envelope--open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const handleKeyDownEnvelope = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onRequestOpen()
  }

  return (
    <div
      className={[
        'fixed inset-0 z-50 grid place-items-center px-4 py-10 transition-all duration-[800ms] ease-out',
        isOpen ? 'pointer-events-none opacity-0' : 'opacity-100',
      ].join(' ')}
      aria-hidden={isOpen}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#fffef9_0%,#f3efe4_45%,#e8e4d6_100%)]" />
      <div className="pointer-events-none absolute left-[-9rem] top-[-7rem] h-[22rem] w-[22rem] rounded-full bg-[#b0b074]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] right-[-6rem] h-[20rem] w-[20rem] rounded-full bg-[#d4c4a8]/25 blur-3xl" />

      <div className="relative w-full max-w-[420px]">
        <header className="mb-8 text-center">
          <p className="text-[0.7rem] uppercase tracking-[0.48em] text-[#6b6354]">
            Вы приглашены
          </p>
          <p className="mt-3 font-light text-2xl tracking-[0.2em] text-[#3d382e] sm:text-3xl">
            НА СВАДЬБУ <span aria-hidden="true">🤍</span>
          </p>
          <div className="mx-auto mt-5 h-px max-w-[12rem] inv-hero-ribbon" />
          <p className="mt-4 text-[0.68rem] uppercase tracking-[0.38em] text-[#8a8070]">
            {EVENT_DATE_LABEL}
          </p>
        </header>

        <div
          className="inv-envelope-scene mx-auto grid w-full max-w-[380px] cursor-pointer place-items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#8a8352] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3efe4]"
          role="button"
          tabIndex={0}
          aria-label="Открыть конверт с приглашением"
          onClick={onRequestOpen}
          onKeyDown={handleKeyDownEnvelope}
        >
          <div className={envelopeClass}>
            <div className="inv-envelope__shadow" aria-hidden="true" />
            <div className="inv-envelope__back" />
            <div className="inv-envelope__inner">
              <div className="inv-envelope__letter">
                <div className="px-1">
                  <p className="text-[0.6rem] uppercase tracking-[0.42em] text-[#9a8f7e]">
                    ВЫ ПРИГЛАШЕНЫ
                  </p>
                  <p className="mt-2 text-base font-light tracking-[0.16em] text-[#2f2a22]">
                    {COUPLE_TITLE}
                  </p>
                  <p className="mt-2 text-[0.62rem] uppercase tracking-[0.28em] text-[#a89880]">
                    {EVENT_DATE_LABEL}
                  </p>
                </div>
              </div>
            </div>
            <div className="inv-envelope__pocket" aria-hidden="true" />
            <div className="inv-envelope__flap-wrap">
              <div className="inv-envelope__flap" />
            </div>
            <div className="inv-envelope__seal" aria-hidden="true">
              💌
            </div>
          </div>
        </div>

        <p className="inv-envelope__hint">нажмите на конверт или кнопку</p>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="invite-button min-w-[240px]"
            onClick={(event) => {
              event.stopPropagation()
              onRequestOpen()
            }}
            aria-label="Открыть приглашение"
          >
            ОТКРЫТЬ
          </button>
        </div>
      </div>
    </div>
  )
}

const LoveDivider = () => (
  <div
    className="mx-auto flex max-w-md items-center gap-4 py-6 text-[#a89880]"
    aria-hidden="true"
  >
    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c4b896] to-transparent" />
    <span className="text-[0.75rem] tracking-[0.5em]">❦</span>
    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c4b896] to-transparent" />
  </div>
)

const LoveH2 = ({
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

const LoveCard = ({
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

export default function InvitationPage() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [isOpened, setIsOpened] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [isMusicEnabled, setIsMusicEnabled] = useState(true)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [isMusicAvailable, setIsMusicAvailable] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const storedMusic =
      typeof window === 'undefined' ? null : window.localStorage.getItem(MUSIC_STORAGE_KEY)

    if (storedMusic === '0') queueMicrotask(() => setIsMusicEnabled(false))
  }, [])

  useEffect(() => {
    const delay = prefersReducedMotion ? 200 : PRELOADER_MS
    const timeoutId = window.setTimeout(() => setPreloaderDone(true), delay)

    return () => window.clearTimeout(timeoutId)
  }, [prefersReducedMotion])

  useEffect(() => {
    if (typeof document === 'undefined') return

    if (isOpened) {
      document.documentElement.style.overflow = ''
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [isOpened])

  const mapHref = useMemo(() => {
    const query = encodeURIComponent(VENUE.mapQuery)
    return `https://yandex.ru/maps/?text=${query}`
  }, [])

  const tryPlayMusic = () => {
    if (!isMusicEnabled) return

    const audio = audioRef.current
    if (!audio) return

    const playPromise = audio.play()
    if (!playPromise) return

    playPromise
      .then(() => setIsMusicPlaying(true))
      .catch(() => setIsMusicPlaying(false))
  }

  const handleRequestOpen = () => {
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

      tryPlayMusic()
    }, delay)
  }

  const handleToggleMusic = () => {
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

    const playPromise = audio.play()
    if (!playPromise) return

    playPromise
      .then(() => setIsMusicPlaying(true))
      .catch(() => setIsMusicPlaying(false))
  }

  const musicLabel = isMusicEnabled ? 'Выключить' : 'Включить'

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden">
      <audio
        ref={audioRef}
        src="/Bruno Mars - Merry You.mp3"
        preload="auto"
        loop
        onError={() => {
          setIsMusicAvailable(false)
          setIsMusicEnabled(false)
          setIsMusicPlaying(false)
          window.localStorage.setItem(MUSIC_STORAGE_KEY, '0')
        }}
      />

      <Preloader done={preloaderDone} />
      <EnvelopeGate
        isOpen={isOpened}
        isOpening={isOpening}
        onRequestOpen={handleRequestOpen}
      />

      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,#fffdf8_0%,#f4efe6_42%,#ebe4d6_100%)]"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
        <div id="invite-start" className="scroll-mt-6">
          <RevealOnScroll>
            <header className="text-center">
              <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#9a907c]">
                Love is
              </p>
              <p className="mt-4 text-[0.72rem] uppercase tracking-[0.38em] text-[#7a7160]">
                Вы приглашены
              </p>
              <h1 className="mt-3 text-3xl font-light tracking-[0.18em] text-[#2e281f] sm:text-4xl">
                НА СВАДЬБУ <span aria-hidden="true">❤️</span>
              </h1>
              <p className="mt-5 text-lg tracking-[0.12em] text-[#4a4338]">
                {EVENT_DATE_LABEL}
              </p>
            </header>
          </RevealOnScroll>

          <LoveDivider />

          <RevealOnScroll>
            <LoveCard>
              <p className="text-center text-[1.05rem] leading-8 text-[#4f463a]">
                В нашей жизни произойдёт очень важное событие — наша свадьба!
                Позвольте пригласить вас разделить с нами радость этого дня.
              </p>
            </LoveCard>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="mt-8">
              <LoveH2 kicker="Музыка">Перед прочтением включите музыку</LoveH2>
              <LoveCard className="mt-5 text-center">
                <p className="text-sm leading-7 text-[#5c5348]">
                  Если вас отвлекает музыка, её можно выключить.
                </p>
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-[#c4b896] bg-[#faf8f3] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#5a5245] transition hover:-translate-y-0.5 hover:bg-white"
                    onClick={handleToggleMusic}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') return
                      event.preventDefault()
                      handleToggleMusic()
                    }}
                    aria-pressed={isMusicEnabled}
                    aria-label="Переключить музыку"
                    disabled={!isMusicAvailable}
                  >
                    {musicLabel}
                    {isMusicEnabled && isMusicPlaying ? (
                      <span
                        className="ml-3 h-2 w-2 rounded-full bg-[#8a8352]"
                        aria-hidden="true"
                      />
                    ) : null}
                  </button>
                </div>
                {isMusicAvailable ? (
                  <p className="mt-3 text-[0.65rem] uppercase tracking-[0.32em] text-[#9a907c]">
                    Музыка запускается после открытия конверта
                  </p>
                ) : (
                  <p className="mt-3 text-[0.65rem] uppercase tracking-[0.32em] text-[#9a907c]">
                    Файл музыки не найден в public
                  </p>
                )}
              </LoveCard>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="mt-10">
              <LoveH2>Будем рады видеть вас</LoveH2>
              <p className="mt-3 text-center text-sm text-[#6b6254]">
                Дата торжества: {EVENT_DATE_LABEL}
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="mt-10" id="place">
              <LoveH2 kicker="Локация">{VENUE.name}</LoveH2>
              <LoveCard className="mt-5 text-center">
                <p className="font-medium text-[#2c261c]">{VENUE.lines[0]}</p>
                <p className="mt-1 font-medium text-[#2c261c]">{VENUE.lines[1]}</p>
                <a
                  className="invite-button mt-6 w-full max-w-[280px]"
                  href={mapHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  Посмотреть на карте
                </a>
              </LoveCard>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="mt-12">
              <LoveH2 kicker="Программа">Тайминг дня</LoveH2>
              <ul className="relative mt-8 space-y-0 pl-2">
                <span
                  className="absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-[#c4b896] via-[#d8d0bc] to-transparent"
                  aria-hidden="true"
                />
                {schedule.map((item) => (
                  <li
                    key={`${item.time}-${item.title}`}
                    className="relative flex gap-4 pb-8 last:pb-0"
                  >
                    <span
                      className="relative z-[1] mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-[#faf8f3] bg-[#b0b074] shadow-[0_0_0_1px_rgba(176,176,116,0.35)]"
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8a7f6a]">
                        {item.time}
                      </p>
                      <p className="mt-1 text-lg text-[#2c261c]">{item.title}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="mt-12 space-y-5" id="details">
              <LoveH2 kicker="Пожелания">Детали для гостей</LoveH2>
              <LoveCard>
                <p className="text-sm leading-7 text-[#4f463a]">
                  Будем признательны за альтернативу букетам в виде бутылки вина или
                  другого напитка и записки о событии, к которому приурочить его
                  открытие.
                </p>
              </LoveCard>
              <LoveCard>
                <p className="text-sm leading-7 text-[#4f463a]">
                  Обратите внимание: формат мероприятия не предполагает детской площадки
                  и аниматоров. Пожалуйста, позаботьтесь о том, чтобы провести этот
                  вечер без детей.
                </p>
              </LoveCard>
              <LoveCard>
                <p className="text-sm leading-7 text-[#4f463a]">
                  Будем благодарны, если вы воздержитесь от криков «Горько!». Для нас
                  поцелуй — знак чувств, он не может быть «по заказу».
                </p>
              </LoveCard>
              <LoveCard>
                <p className="text-sm leading-7 text-[#4f463a]">
                  Просим воздержаться от ярких агрессивных цветов в одежде и отдать
                  предпочтение спокойным тонам.
                </p>
              </LoveCard>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="mt-12">
              <LoveH2 kicker="Дресс-код">Цвета и стиль</LoveH2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <LoveCard className="text-center">
                  <p className="text-[0.65rem] uppercase tracking-[0.32em] text-[#8a7f6a]">
                    Для девушек
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {dressCodeForLadies.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[#dcd3c2] bg-[#faf6ef] px-3 py-1.5 text-sm text-[#4f463a]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </LoveCard>
                <LoveCard className="text-center">
                  <p className="text-[0.65rem] uppercase tracking-[0.32em] text-[#8a7f6a]">
                    Для мужчин
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {dressCodeForMen.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[#dcd3c2] bg-[#faf6ef] px-3 py-1.5 text-sm text-[#4f463a]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-[#6b6254]">
                    Помните: в белом должна быть только невеста :)
                  </p>
                </LoveCard>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="mt-12" id="rsvp">
              <LoveH2 kicker="Анкета">
                Ответьте, пожалуйста, на несколько вопросов
              </LoveH2>
              <form className="mt-6 space-y-6">
                <LoveCard>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-[#4a4338]">ФИО</span>
                      <input
                        className="invite-field"
                        placeholder="Напишите, пожалуйста, ваши ФИО"
                        type="text"
                        autoComplete="name"
                      />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-[#4a4338]">
                        Телефон
                      </span>
                      <input
                        className="invite-field"
                        placeholder="+7 (999) 999-99-99"
                        type="tel"
                        autoComplete="tel"
                      />
                    </label>
                  </div>
                </LoveCard>

                <LoveCard>
                  <fieldset>
                    <legend className="mb-3 text-sm font-medium text-[#4a4338]">
                      Сможете ли присутствовать на нашем торжестве?
                    </legend>
                    <div className="flex flex-col gap-3">
                      {[
                        'Я с удовольствием приду',
                        'К сожалению, не смогу присутствовать',
                      ].map((item) => (
                        <label
                          key={item}
                          className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-[#e2d8c8] bg-[#fffcf7] px-4 py-3 text-sm text-[#4a4338]"
                        >
                          <input
                            name="attendance"
                            type="radio"
                            className="h-4 w-4 accent-[#8a8352]"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </LoveCard>

                <LoveCard>
                  <fieldset>
                    <legend className="mb-3 text-sm font-medium text-[#4a4338]">
                      Что предпочитаете из напитков?
                    </legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {drinks.map((item) => (
                        <label
                          key={item}
                          className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-[#e2d8c8] bg-[#fffcf7] px-4 py-3 text-sm text-[#4a4338]"
                        >
                          <input className="h-4 w-4 accent-[#8a8352]" type="checkbox" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </LoveCard>

                <LoveCard>
                  <fieldset>
                    <legend className="mb-3 text-sm font-medium text-[#4a4338]">
                      Ваши предпочтения по еде
                    </legend>
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      {['Птица', 'Мясо', 'Рыба'].map((item) => (
                        <label
                          key={item}
                          className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-[#e2d8c8] bg-[#fffcf7] px-4 py-3 text-sm text-[#4a4338]"
                        >
                          <input
                            name="food"
                            type="radio"
                            className="h-4 w-4 accent-[#8a8352]"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </LoveCard>

                <LoveCard>
                  <fieldset>
                    <legend className="mb-3 text-sm font-medium text-[#4a4338]">
                      Нужен ли вам трансфер?
                    </legend>
                    <div className="flex flex-wrap gap-3">
                      {['Да', 'Нет'].map((item) => (
                        <label
                          key={item}
                          className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-[#e2d8c8] bg-[#fffcf7] px-4 py-3 text-sm text-[#4a4338]"
                        >
                          <input
                            name="transfer"
                            type="radio"
                            className="h-4 w-4 accent-[#8a8352]"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </LoveCard>

                <div className="flex justify-center pt-2">
                  <button className="invite-button px-10" type="submit">
                    Отправить
                  </button>
                </div>
                <p className="text-center text-xs leading-6 text-[#7a7160]">
                  Нажимая «Отправить», вы соглашаетесь с политикой конфиденциальности.
                </p>
              </form>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="mt-12 pb-8">
              <LoveH2 kicker="Контакты">Организаторы</LoveH2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <LoveCard>
                  <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[#8a7f6a]">
                    Организатор
                  </p>
                  <p className="mt-2 font-medium text-[#2c261c]">Анастасия</p>
                  <a
                    className="mt-3 block text-lg font-semibold tracking-wide text-[#6b6338]"
                    href="tel:+79999999999"
                  >
                    +7 (999) 999-99-99
                  </a>
                </LoveCard>
                <LoveCard>
                  <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[#8a7f6a]">
                    Ведущий
                  </p>
                  <p className="mt-2 font-medium text-[#2c261c]">Уточните имя</p>
                  <a
                    className="mt-3 block text-lg font-semibold tracking-wide text-[#6b6338]"
                    href="tel:+79999999998"
                  >
                    +7 (999) 999-99-98
                  </a>
                </LoveCard>
              </div>
              <div className="mt-6 flex justify-center">
                <a
                  className="inline-flex items-center justify-center rounded-full border border-[#c4b896] bg-white/90 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#5a5245] transition hover:-translate-y-0.5"
                  href="https://wa.me/79999999999"
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </main>
  )
}
