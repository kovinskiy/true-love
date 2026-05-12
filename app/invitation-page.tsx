'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

const EVENT_DATE = {
  day: '25',
  month: '09',
  year: '26',
} as const

const EVENT_DATE_LABEL = `${EVENT_DATE.day} | ${EVENT_DATE.month} | ${EVENT_DATE.year}`

const MUSIC_STORAGE_KEY = 'true-love:music-enabled'

const schedule = [
  {
    time: "16:00",
    title: "Сбор гостей",
    description:
      "Собираясь на торжество, возьмите с собой улыбки и хорошее настроение.",
  },
  {
    time: "16:30",
    title: "Церемония",
    description: "Приготовьте платочки для трогательного момента.",
  },
  {
    time: "17:00",
    title: "Банкет",
    description: "Время вкусной еды и развлечений.",
  },
  {
    time: "21:00",
    title: "Торт",
    description: "Сладкая традиция, которую мы не можем пропустить.",
  },
  {
    time: "22:00",
    title: "Дискотека",
    description: "Приятная музыка и танцы.",
  },
  {
    time: "23:00",
    title: "Happy end",
    description: "К сожалению, даже такой волшебный вечер может подойти к концу.",
  },
];

const drinks = [
  "Белое вино",
  "Красное вино",
  "Шампанское",
  "Водка",
  "Коньяк",
  "Не пью алкоголь",
];

const dressCodeForLadies = ["бежевые", "пастельные оттенки"];
const dressCodeForMen = ["черный низ", "белая рубашка"];

function Cover({
  isOpen,
  onOpen,
}: {
  isOpen: boolean
  onOpen: () => void
}) {
  return (
    <div
      className={[
        'fixed inset-0 z-50 grid place-items-center px-4 py-8 transition-all duration-700',
        isOpen ? 'pointer-events-none opacity-0 blur-sm' : 'opacity-100',
      ].join(' ')}
      aria-hidden={isOpen}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(255,245,236,0.68)_30%,_rgba(239,228,216,0.95)_72%)]" />
      <div className="pointer-events-none absolute left-[-10rem] top-[-8rem] h-[26rem] w-[26rem] rounded-full bg-[#d9b79f]/25 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] top-[24rem] h-[22rem] w-[22rem] rounded-full bg-[#b98d72]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10rem] left-1/2 h-[20rem] w-[20rem] -translate-x-1/2 rounded-full bg-[#f4d9c6]/40 blur-3xl" />

      <section className="relative w-full max-w-lg overflow-hidden rounded-[2.25rem] border border-[#dbc6b3] bg-[rgba(255,250,244,0.88)] shadow-[0_28px_90px_rgba(101,68,40,0.14)] backdrop-blur">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8f6650] via-[#c7a28d] to-[#8f6650]" />

        <div className="p-7 sm:p-10">
          <div className="space-y-3 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.55em] text-[#b18c76]">
              ВЫ ПРИГЛАШЕНЫ
            </p>
            <p className="text-3xl font-light tracking-[0.25em] text-[#8f6c58] sm:text-4xl">
              НА СВАДЬБУ <span aria-hidden="true">🤎</span>
            </p>
          </div>

          <Separator />

          <div className="mx-auto grid max-w-sm gap-5 text-center">
            <button
              type="button"
              className="invite-button w-full"
              onClick={onOpen}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return
                event.preventDefault()
                onOpen()
              }}
              aria-label="Открыть приглашение"
            >
              ОТКРЫТЬ
            </button>

            <p className="text-xs uppercase tracking-[0.45em] text-[#a27e67]">
              {EVENT_DATE_LABEL}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function Separator() {
  return (
    <div className="flex items-center gap-4 py-2 text-[#9a7a64]">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c9aa93] to-transparent" />
      <span className="text-[0.7rem] tracking-[0.55em]">❦</span>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c9aa93] to-transparent" />
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-2 text-center">
      <p className="text-[0.72rem] uppercase tracking-[0.45em] text-[#a27e67]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-[0.08em] text-[#2f211a] sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto max-w-2xl text-sm leading-7 text-[#6f5648] sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default function InvitationPage() {
  const [isOpened, setIsOpened] = useState(false)
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
    if (typeof document === 'undefined') return

    if (isOpened) {
      document.documentElement.style.overflow = ''
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [isOpened])

  const mapHref = useMemo(() => {
    const query = encodeURIComponent(
      'Horse Village Ростовская область, Азовский район, Обильненское сельское поселение'
    )
    return `https://yandex.ru/maps/?text=${query}`
  }, [])

  const handleOpen = () => {
    setIsOpened(true)

    queueMicrotask(() => {
      const detailsSection = document.getElementById('details')
      if (!detailsSection) return
      detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })

    const shouldTryPlay = isMusicEnabled
    if (!shouldTryPlay) return

    const audio = audioRef.current
    if (!audio) return

    const playPromise = audio.play()
    if (!playPromise) return

    playPromise
      .then(() => setIsMusicPlaying(true))
      .catch(() => setIsMusicPlaying(false))
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
    <main className="relative isolate overflow-hidden">
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
      <Cover isOpen={isOpened} onOpen={handleOpen} />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(255,245,236,0.68)_30%,_rgba(239,228,216,0.95)_72%)]" />
      <div className="pointer-events-none absolute left-[-10rem] top-[-8rem] h-[26rem] w-[26rem] rounded-full bg-[#d9b79f]/25 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] top-[24rem] h-[22rem] w-[22rem] rounded-full bg-[#b98d72]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10rem] left-1/2 h-[20rem] w-[20rem] -translate-x-1/2 rounded-full bg-[#f4d9c6]/40 blur-3xl" />

      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2.25rem] border border-[#dbc6b3] bg-[rgba(255,250,244,0.88)] shadow-[0_28px_90px_rgba(101,68,40,0.14)] backdrop-blur">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8f6650] via-[#c7a28d] to-[#8f6650]" />

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:p-10">
            <div className="flex flex-col justify-center gap-6">
              <div className="space-y-2 text-center lg:text-left">
                <p className="text-2xl font-light tracking-[0.25em] text-[#8f6c58] sm:text-3xl">
                  Вы приглашены
                </p>
                <p className="text-sm uppercase tracking-[0.55em] text-[#b18c76]">
                  НА СВАДЬБУ
                </p>
                <h1 className="text-5xl font-semibold leading-none tracking-[0.12em] text-[#2d1f18] sm:text-6xl">
                  TRUE LOVE
                </h1>
              </div>

              <Separator />

              <div className="mx-auto grid w-full max-w-md gap-3 text-center lg:mx-0 lg:text-left">
                <div className="inline-flex items-center justify-center gap-3 self-center rounded-full border border-[#d7b9a3] bg-white/75 px-5 py-2 text-[0.72rem] uppercase tracking-[0.35em] text-[#9a7460] shadow-sm lg:self-start">
                  <span>{EVENT_DATE.day}</span>
                  <span>|</span>
                  <span>{EVENT_DATE.month}</span>
                  <span>|</span>
                  <span>{EVENT_DATE.year}</span>
                </div>
                <p className="text-lg font-medium leading-8 text-[#2f211a] sm:text-xl">
                  Узнаете этих детишек?
                </p>
                <p className="text-base leading-8 text-[#6d5446] sm:text-[1.05rem]">
                  Да-да, это мы!
                  <br />
                  Время пролетело очень быстро, представляете?
                </p>
                <p className="text-base leading-8 text-[#6d5446] sm:text-[1.05rem]">
                  И вот уже совсем скоро состоится самое важное событие в нашей
                  жизни — мы станем одной семьей!
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <a className="invite-button" href="#details">
                  Открыть
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-full border border-[#cab19d] bg-white/65 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#735341] transition hover:-translate-y-0.5 hover:bg-white"
                  href="#rsvp"
                >
                  Анкета
                </a>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-[28rem] overflow-hidden rounded-[2rem] border border-[#dbc5b1] bg-[linear-gradient(180deg,#f8eadf_0%,#f3ddcf_46%,#ead1c0_100%)] p-5 shadow-[0_24px_60px_rgba(106,74,50,0.18)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.68),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.46),transparent_22%),radial-gradient(circle_at_50%_90%,rgba(158,112,83,0.18),transparent_32%)]" />

                <div className="relative rounded-[1.7rem] border border-white/55 bg-white/38 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  <div className="grid aspect-[4/5] place-items-center rounded-[1.35rem] border border-[#e8d7ca] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(245,232,222,0.82))]">
                    <div className="relative flex h-[18rem] w-[18rem] items-center justify-center sm:h-[20rem] sm:w-[20rem]">
                      <div className="absolute left-5 top-6 h-24 w-24 rounded-full bg-[#f6e7de] blur-2xl" />
                      <div className="absolute right-7 top-10 h-20 w-20 rounded-full bg-[#d8a98f]/40 blur-2xl" />
                      <div className="absolute bottom-7 left-10 h-24 w-24 rounded-full bg-[#fff8f2]/70 blur-2xl" />

                      <div className="absolute inset-x-6 top-10 h-28 rounded-[1.5rem] border border-[#c9a78f] bg-[#fff7f2] shadow-[0_16px_30px_rgba(95,64,42,0.14)]" />
                      <div className="absolute inset-x-6 top-28 h-[10rem] rounded-[1.5rem] border border-[#ba947d] bg-[#ebd1bf] shadow-[0_20px_45px_rgba(95,64,42,0.2)]" />
                      <div className="absolute inset-x-16 top-36 h-[9rem] rotate-[-8deg] rounded-[1.1rem] border border-[#d8b49d] bg-[#fff9f4] shadow-[0_18px_35px_rgba(96,65,43,0.16)]" />
                      <div className="absolute inset-x-11 top-42 h-[6.8rem] rotate-[8deg] rounded-[1rem] border border-[#caa28d] bg-[#f4e2d6] shadow-[0_18px_35px_rgba(96,65,43,0.15)]" />

                      <div className="relative z-10 flex h-36 w-36 items-center justify-center rounded-full border border-[#d4b39d] bg-[#fffaf7]/90 shadow-[0_16px_30px_rgba(110,78,50,0.12)]">
                        <div className="text-center">
                          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#9a765f]">
                            Invitation
                          </p>
                          <p className="mt-2 text-3xl font-semibold tracking-[0.2em] text-[#2f211b]">
                            25
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.4em] text-[#b28d77]">
                            {EVENT_DATE.month} {EVENT_DATE.year}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-4" />

        <section id="details" className="invite-section p-6 sm:p-8 lg:p-10">
          <SectionTitle
            eyebrow="История"
            title="Узнаете этих детишек?"
            subtitle="Да-да, это мы! Время пролетело очень быстро, и вот уже совсем скоро состоится самое важное событие в нашей жизни."
          />
          <Separator />
          <div className="rounded-[1.25rem] border border-[#dcc6b2] bg-white/70 px-5 py-4 text-center text-sm leading-7 text-[#6f5648] sm:px-6">
            <p>
              Если Вас отвлекает музыка, ее можно выключить
            </p>
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-[#cab19d] bg-white/65 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#735341] transition hover:-translate-y-0.5 hover:bg-white"
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
                  <span className="ml-3 h-2 w-2 rounded-full bg-[#8e6650]" aria-hidden="true" />
                ) : null}
              </button>
            </div>
            {isMusicAvailable ? (
              <p className="mt-3 text-xs uppercase tracking-[0.35em] text-[#a27e67]">
                Музыка запустится после нажатия «Открыть»
              </p>
            ) : (
              <p className="mt-3 text-xs uppercase tracking-[0.35em] text-[#a27e67]">
                Файл музыки не найден: положи его в `public/music.mp3`
              </p>
            )}
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div className="space-y-4 text-center text-base leading-8 text-[#6f5648] lg:text-left">
              <p>
                И вот уже совсем скоро состоится самое важное событие в нашей
                жизни — мы станем одной семьей!
              </p>
              <p>
                Мы очень ждём и с удовольствием готовимся к нашему
                незабываемому дню.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-[#decab9] bg-[linear-gradient(180deg,#fff8f3,#f5e5d8)] p-5 shadow-[0_14px_34px_rgba(99,67,43,0.12)]">
              <div className="flex items-center justify-between rounded-[1.2rem] border border-[#e6d6c9] bg-white/80 px-4 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#a27e67]">
                    Дата
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[0.22em] text-[#2d1f18]">
                    {EVENT_DATE_LABEL}
                  </p>
                </div>
                <div className="grid h-20 w-20 place-items-center rounded-full border border-[#d6bca8] bg-[#f6e6da] text-center text-[#8c6752]">
                  <span className="text-[0.65rem] uppercase tracking-[0.45em]">
                    Love
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-4" />

        <section className="invite-section p-6 sm:p-8 lg:p-10">
          <SectionTitle
            eyebrow="Место"
            title="Horse Village"
            subtitle="Ростовская область, Азовский район, Обильненское сельское поселение."
          />
          <Separator />
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="space-y-3 text-center text-base leading-8 text-[#6f5648] lg:text-left">
              <p className="font-medium text-[#2f211a]">
                Horse Village Ростовская область, Азовский район,
                <br />
                Обильненское сельское поселение
              </p>
              <a
                className="inline-flex items-center justify-center rounded-full border border-[#ceb4a0] bg-white/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#735341] transition hover:-translate-y-0.5 hover:bg-white"
                href={mapHref}
                target="_blank"
                rel="noreferrer"
              >
                На карте
              </a>
            </div>

            <div className="rounded-[1.6rem] border border-[#decab9] bg-[linear-gradient(135deg,#f3d8c5,#fff9f5_65%,#ead2c2)] p-5 shadow-[0_14px_34px_rgba(99,67,43,0.12)]">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.3rem] border border-white/60 bg-[radial-gradient(circle_at_30%_35%,rgba(255,255,255,0.95),transparent_26%),radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.55),transparent_20%),linear-gradient(180deg,#fefaf7,#efdbc9)]">
                <div className="absolute inset-x-10 top-10 h-24 rounded-[999px] bg-white/40 blur-2xl" />
                <div className="absolute bottom-6 left-6 right-6 h-16 rounded-[1.2rem] border border-[#d7b9a3] bg-white/60 shadow-[0_18px_30px_rgba(100,71,47,0.12)]" />
                <div className="absolute left-1/2 top-8 h-[calc(100%-4rem)] w-[1px] -translate-x-1/2 bg-[#d4b29a]/80" />
                <div className="absolute left-10 top-12 h-16 w-16 rounded-full border border-[#d5b39d] bg-[#fff8f3]" />
                <div className="absolute right-10 top-16 h-20 w-20 rounded-full border border-[#d5b39d] bg-[#fff8f3]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full border border-[#d9bca8] bg-white/75 px-5 py-3 text-center text-xs uppercase tracking-[0.4em] text-[#9a765f] shadow-sm">
                    Google / Yandex map
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-4" />

        <section className="invite-section p-6 sm:p-8 lg:p-10">
          <SectionTitle
            eyebrow="Программа"
            title="Расписание дня"
            subtitle="Короткий маршрут нашего праздничного вечера."
          />
          <Separator />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {schedule.map((item) => (
              <article
                key={`${item.time}-${item.title}`}
                className="rounded-[1.5rem] border border-[#d9c3b1] bg-white/75 p-5 shadow-[0_10px_24px_rgba(94,65,44,0.08)]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#a27e67]">
                  {item.time}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-[#2f211a]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#6f5648]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="h-4" />

        <section className="invite-section p-6 sm:p-8 lg:p-10">
          <SectionTitle
            eyebrow="Детали"
            title="Пожелания"
            subtitle="Свои тёплые слова и пожелания приносите в сердцах, а подарки - в конверте."
          />
          <Separator />
          <div className="grid gap-4 lg:grid-cols-3">
            <article className="rounded-[1.5rem] border border-[#dcc6b2] bg-[linear-gradient(180deg,#fffdf8,#f6e8db)] p-5 text-center shadow-[0_10px_24px_rgba(94,65,44,0.08)]">
              <p className="text-lg font-semibold text-[#2f211a]">
                Наш праздник для взрослых
              </p>
              <p className="mt-3 text-sm leading-7 text-[#6f5648]">
                По возможности, оставьте детей под присмотром и погрузитесь в
                мир романтики вместе с нами!
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-[#dcc6b2] bg-[linear-gradient(180deg,#fffdf8,#f6e8db)] p-5 text-center shadow-[0_10px_24px_rgba(94,65,44,0.08)]">
              <p className="text-lg font-semibold text-[#2f211a]">
                Без букетов
              </p>
              <p className="mt-3 text-sm leading-7 text-[#6f5648]">
                Просим Вас не дарить нам цветы - сразу после свадьбы мы улетаем
                в свадебное путешествие и не успеем насладиться их красотой.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-[#dcc6b2] bg-[linear-gradient(180deg,#fffdf8,#f6e8db)] p-5 text-center shadow-[0_10px_24px_rgba(94,65,44,0.08)]">
              <p className="text-lg font-semibold text-[#2f211a]">
                Классический стиль
              </p>
              <p className="mt-3 text-sm leading-7 text-[#6f5648]">
                Поддержите нас вашими улыбками и красивыми нарядами.
              </p>
            </article>
          </div>
        </section>

        <div className="h-4" />

        <section className="invite-section p-6 sm:p-8 lg:p-10">
          <SectionTitle
            eyebrow="Дресс-код"
            title="Цвета и стиль"
            subtitle="Будем благодарны, если Вы поддержите цветовую гамму нашей свадьбы."
          />
          <Separator />
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-[1.5rem] border border-[#dcc6b2] bg-white/75 p-5 text-center shadow-[0_10px_24px_rgba(94,65,44,0.08)]">
              <p className="text-sm uppercase tracking-[0.35em] text-[#a27e67]">
                Для девушек
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {dressCodeForLadies.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#d4bba8] bg-[#f4e5d9] px-4 py-2 text-sm text-[#6b5144]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
            <article className="rounded-[1.5rem] border border-[#dcc6b2] bg-white/75 p-5 text-center shadow-[0_10px_24px_rgba(94,65,44,0.08)]">
              <p className="text-sm uppercase tracking-[0.35em] text-[#a27e67]">
                Для мужчин
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {dressCodeForMen.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#d4bba8] bg-[#f4e5d9] px-4 py-2 text-sm text-[#6b5144]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm text-[#6f5648]">
                Помните, что в белом должна быть только невеста :)
              </p>
            </article>
          </div>
        </section>

        <div className="h-4" />

        <section id="rsvp" className="invite-section p-6 sm:p-8 lg:p-10">
          <SectionTitle
            eyebrow="Анкета"
            title="Ответьте, пожалуйста, на несколько вопросов, которые мы для Вас подготовили"
            subtitle="Это поможет нам подготовить праздник с ещё большей заботой."
          />
          <Separator />

          <form className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-[#5f473d]">
                  ФИО
                </span>
                <input
                  className="invite-field"
                  placeholder="Напишите, пожалуйста, Ваше ФИО"
                  type="text"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-[#5f473d]">
                  Ваш телефон
                </span>
                <input
                  className="invite-field"
                  placeholder="+7 (999) 999-99-99"
                  type="tel"
                />
              </label>
            </div>

            <fieldset className="space-y-3 rounded-[1.5rem] border border-[#dcc6b2] bg-white/75 p-5">
              <legend className="px-2 text-sm font-medium text-[#5f473d]">
                Сможете ли присутствовать на нашем торжестве?
              </legend>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {["Я с удовольствием приду", "К сожалению, не смогу присутствовать"].map(
                  (item) => (
                    <label
                      key={item}
                      className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-[#d6c0ad] bg-[#fffaf6] px-4 py-3 text-sm text-[#5f473d]"
                    >
                      <input
                        name="attendance"
                        type="radio"
                        className="h-4 w-4 border-[#b38c74] text-[#8e6650] accent-[#8e6650]"
                      />
                      <span>{item}</span>
                    </label>
                  )
                )}
              </div>
            </fieldset>

            <fieldset className="space-y-3 rounded-[1.5rem] border border-[#dcc6b2] bg-white/75 p-5">
              <legend className="px-2 text-sm font-medium text-[#5f473d]">
                Что предпочитаете из напитков?
              </legend>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {drinks.map((item) => (
                  <label
                    key={item}
                    className="inline-flex cursor-pointer items-center gap-3 rounded-[1rem] border border-[#d6c0ad] bg-[#fffaf6] px-4 py-3 text-sm text-[#5f473d]"
                  >
                    <input
                      className="h-4 w-4 accent-[#8e6650]"
                      type="checkbox"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-3 rounded-[1.5rem] border border-[#dcc6b2] bg-white/75 p-5">
              <legend className="px-2 text-sm font-medium text-[#5f473d]">
                Ваши предпочтения по еде
              </legend>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {["Птица", "Мясо", "Рыба"].map((item) => (
                  <label
                    key={item}
                    className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-[#d6c0ad] bg-[#fffaf6] px-4 py-3 text-sm text-[#5f473d]"
                  >
                    <input
                      name="food"
                      type="radio"
                      className="h-4 w-4 accent-[#8e6650]"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-3 rounded-[1.5rem] border border-[#dcc6b2] bg-white/75 p-5">
              <legend className="px-2 text-sm font-medium text-[#5f473d]">
                Нужен ли Вам трансфер?
              </legend>
              <div className="flex gap-3">
                {["Да", "Нет"].map((item) => (
                  <label
                    key={item}
                    className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-[#d6c0ad] bg-[#fffaf6] px-4 py-3 text-sm text-[#5f473d]"
                  >
                    <input
                      name="transfer"
                      type="radio"
                      className="h-4 w-4 accent-[#8e6650]"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex justify-center">
              <button className="invite-button" type="submit">
                Отправить
              </button>
            </div>

            <p className="text-center text-sm leading-7 text-[#7a6154]">
              Нажимая кнопку &quot;Отправить&quot;, Вы соглашаетесь с Политикой
              конфиденциальности
            </p>
          </form>
        </section>

        <div className="h-4" />

        <section className="invite-section p-6 sm:p-8 lg:p-10">
          <SectionTitle
            eyebrow="Контакты"
            title="Если возникнут вопросы"
            subtitle="В день мероприятия вы можете обратиться к нашему организатору."
          />
          <Separator />
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="space-y-3 text-center lg:text-left">
              <p className="text-lg font-medium text-[#2f211a]">
                Организатор Анастасия:
              </p>
              <a
                className="block text-2xl font-semibold tracking-[0.08em] text-[#8d6550]"
                href="tel:+79999999999"
              >
                +7 (999) 999-99-99
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-[#ccb4a0] bg-white/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#735341] transition hover:-translate-y-0.5 hover:bg-white"
                href="https://wa.me/79999999999"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </div>

            <div className="rounded-[1.6rem] border border-[#decab9] bg-[linear-gradient(180deg,#fff8f3,#f4e1d4)] p-5 shadow-[0_14px_34px_rgba(99,67,43,0.12)]">
              <div className="grid gap-3 rounded-[1.3rem] border border-[#e6d6c9] bg-white/75 p-4 text-sm leading-7 text-[#6f5648]">
                <p>
                  Свои тёплые слова и пожелания приносите в сердцах, а подарки
                  - в конверте.
                </p>
                <p>
                  Для девушек: бежевые и пастельные оттенки. Для мужчин:
                  черный низ и белая рубашка.
                </p>
                <p>Помните, что в белом должна быть только невеста :)</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
