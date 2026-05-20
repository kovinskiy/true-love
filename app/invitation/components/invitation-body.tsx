'use client'

import type { FormEvent, KeyboardEvent } from 'react'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  COUPLE_TITLE,
  dressCodeColors,
  EVENT_DATE,
  EVENT_DATE_TEXT,
  schedule,
  VENUE,
} from '../constants'
import { RevealOnScroll } from './reveal-on-scroll'

export type InvitationBodyProps = {
  mapHref: string
  musicLabel: string
  isMusicEnabled: boolean
  isMusicPlaying: boolean
  isMusicAvailable: boolean
  onToggleMusic: () => void
}

const wishes = [
  'Дорогие гости, приносите с собой веселье и радость в душе, а подарки - в конверте!',
  'Будем благодарны, если Вы воздержитесь от криков "Горько!" на празднике. Для нас поцелуй - знак выражения чувств, он не может быть по заказу.',
  'Просим воздержаться вас от ярких агрессивных цветов в одежде и отдать предпочтение спокойным тонам.',
] as const

const drinkOptions = [
  'Красное вино',
  'Белое вино',
  'Шампанское',
  'Водка',
  'Виски',
  'Коньяк',
  'Не пью алкоголь',
] as const

type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const SECOND_MS = 1000
const MINUTE_MS = SECOND_MS * 60
const HOUR_MS = MINUTE_MS * 60
const DAY_MS = HOUR_MS * 24
const COUNTDOWN_NUMBER_TRANSITION = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1] as const,
}
const EVENT_YEAR = 2000 + Number(EVENT_DATE.year)
const EVENT_MONTH_INDEX = Number(EVENT_DATE.month) - 1
const EVENT_DAY = Number(EVENT_DATE.day)
const EVENT_START_DATE = new Date(EVENT_YEAR, EVENT_MONTH_INDEX, EVENT_DAY)
const calendarWeeks = [
  ['', '', '1', '2', '3', '4', '5'],
  ['6', '7', '8', '9', '10', '11', '12'],
  ['13', '14', '15', '16', '17', '18', '19'],
  ['20', '21', '22', '23', '24', '25', '26'],
  ['27', '28', '29', '30', '31', '', ''],
] as const
const calendarWeekdays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'] as const
const INITIAL_COUNTDOWN: Countdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
}

const getCountdown = (): Countdown => {
  const timeLeft = Math.max(EVENT_START_DATE.getTime() - Date.now(), 0)

  return {
    days: Math.floor(timeLeft / DAY_MS),
    hours: Math.floor((timeLeft % DAY_MS) / HOUR_MS),
    minutes: Math.floor((timeLeft % HOUR_MS) / MINUTE_MS),
    seconds: Math.floor((timeLeft % MINUTE_MS) / SECOND_MS),
  }
}

const getRussianPlural = (
  value: number,
  [one, few, many]: readonly [string, string, string]
) => {
  const modulo100 = value % 100
  const modulo10 = value % 10

  if (modulo100 >= 11 && modulo100 <= 14) return many
  if (modulo10 === 1) return one
  if (modulo10 >= 2 && modulo10 <= 4) return few

  return many
}

const getCountdownAriaLabel = (countdown: Countdown) =>
  `До свадьбы осталось ${countdown.days} ${getRussianPlural(countdown.days, [
    'день',
    'дня',
    'дней',
  ])} ${countdown.hours} ${getRussianPlural(countdown.hours, [
    'час',
    'часа',
    'часов',
  ])} ${countdown.minutes} ${getRussianPlural(countdown.minutes, [
    'минута',
    'минуты',
    'минут',
  ])} ${countdown.seconds} ${getRussianPlural(countdown.seconds, [
    'секунда',
    'секунды',
    'секунд',
  ])}`

type AnimatedCountdownNumberProps = {
  value: number
  prefersReducedMotion: boolean
}

const AnimatedCountdownNumber = ({
  value,
  prefersReducedMotion,
}: AnimatedCountdownNumberProps) => {
  const initial = prefersReducedMotion
    ? { opacity: 0 }
    : { y: 18, scale: 0.92, opacity: 0, filter: 'blur(4px)' }
  const animate = prefersReducedMotion
    ? { opacity: 1 }
    : { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }
  const exit = prefersReducedMotion
    ? { opacity: 0 }
    : { y: -18, scale: 1.08, opacity: 0, filter: 'blur(4px)' }

  return (
    <div className="love-timer__value" aria-hidden="true">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.strong
          key={value}
          initial={initial}
          animate={animate}
          exit={exit}
          transition={COUNTDOWN_NUMBER_TRANSITION}
        >
          {value}
        </motion.strong>
      </AnimatePresence>
    </div>
  )
}

const WeddingCalendar = () => (
  <div className="love-calendar" aria-label="Дата свадьбы: 25 июля 2026">
    <div className="love-calendar__script">25 июля 2026</div>
    <span className="love-calendar__dot" aria-hidden="true" />
    <div className="love-calendar__month">ИЮЛЬ, 2026</div>
    <div className="love-calendar__grid" aria-hidden="true">
      {calendarWeekdays.map((weekday) => (
        <span className="love-calendar__weekday" key={weekday}>
          {weekday}
        </span>
      ))}
      {calendarWeeks.flatMap((week, weekIndex) =>
        week.map((day, dayIndex) => (
          <span
            className={day === EVENT_DATE.day ? 'love-calendar__day love-calendar__day--event' : 'love-calendar__day'}
            key={`${weekIndex}-${dayIndex}`}
          >
            {day}
          </span>
        ))
      )}
    </div>
  </div>
)

type CountdownItemProps = {
  value: number
  labels: readonly [string, string, string]
  isMain?: boolean
  prefersReducedMotion: boolean
}

const CountdownItem = ({
  value,
  labels,
  isMain = false,
  prefersReducedMotion,
}: CountdownItemProps) => (
  <div className={`love-timer__item${isMain ? ' love-timer__item--main' : ''}`}>
    <AnimatedCountdownNumber
      value={value}
      prefersReducedMotion={prefersReducedMotion}
    />
    <span>{getRussianPlural(value, labels)}</span>
  </div>
)

export const InvitationBody = ({
  mapHref,
  musicLabel,
  isMusicEnabled,
  isMusicPlaying,
  isMusicAvailable,
  onToggleMusic,
}: InvitationBodyProps) => {
  const prefersReducedMotion = useReducedMotion()
  const shouldReduceMotion = prefersReducedMotion ?? false

  const handleToggleMusicKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onToggleMusic()
  }

  const [rsvpStatus, setRsvpStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')
  const [rsvpMessage, setRsvpMessage] = useState('')
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN)

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(getCountdown())
    }

    updateCountdown()

    const intervalId = window.setInterval(updateCountdown, SECOND_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const handleRsvpSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    setRsvpStatus('submitting')
    setRsvpMessage('')

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.get('fullName'),
          attendance: formData.get('attendance'),
          transfer: formData.get('transfer'),
          drinks: formData.getAll('drinks'),
          comeRegister: formData.get('comeRegister'),
        }),
      })
      const result = (await response.json()) as { message?: string }

      if (!response.ok) {
        throw new Error(result.message || 'Не удалось отправить ответ.')
      }

      setRsvpStatus('success')
      setRsvpMessage(result.message || 'Ответ отправлен.')
      form.reset()
    } catch (error) {
      setRsvpStatus('error')
      setRsvpMessage(
        error instanceof Error
          ? error.message
          : 'Не удалось отправить ответ. Попробуйте позже.'
      )
    }
  }

  return (
    <div id="invite-start" className="love-page">
      <section className="love-hero">
        <RevealOnScroll>
          <div className="love-hero__inner">
            <h1 className='text-6xl!'>НАША СВАДЬБА</h1>
            <div className="love-heart" aria-hidden="true">♥</div>
            <WeddingCalendar />
            <div className="love-couple">
              <img src="/images/egor.png" alt="Саша" />
              <img src="/images/veronika2.png" alt="Катя" />
            </div>
            <div className="love-nameplate">
              <span>{COUPLE_TITLE}</span>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section className="love-section love-card-section">
        <RevealOnScroll>
          <div className="love-frame">
            <div className="love-panel">
              <h2 className='leading-12!'>ДОРОГИЕ<br />РОДНЫЕ<br />И ДРУЗЬЯ!</h2>
              <div className="love-music">
                <p>Перед прочтением<br />включите музыку</p>
                <button
                  type="button"
                  className="love-music__button"
                  onClick={onToggleMusic}
                  onKeyDown={handleToggleMusicKeyDown}
                  aria-pressed={isMusicEnabled}
                  disabled={!isMusicAvailable}
                >
                  {musicLabel}
                </button>
                {isMusicEnabled && isMusicPlaying ? (
                  <span className="love-music__dot" aria-hidden="true" />
                ) : null}
              </div>
              <p>
                В нашей жизни произойдет<br />
                очень важное событие<br />
                - наша свадьба!<br />
                Позвольте пригласить<br />
                Вас разделить с нами<br />
                радость этого дня.
              </p>
              <div className="absolute left-[-11%] animate-scale bottom-[-48px] w-[200px] h-[200px] transform rotate-[-8deg]" aria-hidden="true">
               <img src="/images/photo.png" alt="Ring" />
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section className="love-section love-where">
        <RevealOnScroll>
          <div className="love-where__grid">
            <div>
              <h2 className='flex items-center gap-2'>
                <img className='animate-spin' src="/images/flower.png" alt="Когда?" />
              Когда?
              </h2>
              <p>Будем рады видеть Вас</p>
              <p>{EVENT_DATE_TEXT}</p>
            </div>
            <div>
              <h2 className='flex items-center gap-2'>
              <img className='animate-spin' src="/images/flower.png" alt="Где?" />
              Где?
              </h2>
              <p>{VENUE.name}</p>
              <p>{VENUE.lines}</p>
            </div>
          </div>
          <a className="love-map-button" href={mapHref} target="_blank" rel="noreferrer">
            Посмотреть на карте <span aria-hidden="true">→</span>
          </a>
        </RevealOnScroll>
      </section>

      <section className="love-section love-plan">
        <RevealOnScroll>
          <h2>ПЛАН</h2>
          <div className="love-plan__items">
            {schedule.map((item, index) => (
              <div
                key={`${item.time}-${item.title}`}
                className="love-plan__item"
                data-side={index % 2 === 0 ? 'left' : 'right'}
              >
                <span aria-hidden="true">✦</span>
                <div>
                  <strong>{item.time}</strong>
                  <p>{item.title}</p>
                </div>
              </div>
            ))}
          </div>
          <span className="love-doodle love-doodle--one" aria-hidden="true">〰</span>
          <span className="love-doodle love-doodle--two" aria-hidden="true">⌁</span>
          <span className="love-doodle love-doodle--three" aria-hidden="true">〰</span>
        </RevealOnScroll>
      </section>

      <section className="love-section love-wishes">
        <RevealOnScroll>
          <div className="love-wishes__layout">
            <h2>ПОЖЕЛАНИЯ</h2>
            <div className="love-wishes__cards">
              {wishes.map((wish, index) => (
                <article key={wish} className="love-wish">
                  <span aria-hidden="true">✿</span>
                  <p>{wish}</p>
                  {index === wishes.length - 1 ? (
                    <>
                      <div className="love-swatches" aria-label="Цвета дресс-кода">
                        {dressCodeColors.map((color) => (
                          <i key={color} style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    </>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section className="love-section love-rsvp">
        <RevealOnScroll>
          <p className="love-rsvp__lead">
            Ответьте, пожалуйста, на несколько<br />
            вопросов, которые мы для Вас подготовили
          </p>
          <div className="love-rsvp__arrow" aria-hidden="true">⌄</div>
          <form className="love-form" onSubmit={handleRsvpSubmit}>
            <label>
              <span>Напишите, пожалуйста, Ваши ФИО</span>
              <input
                type="text"
                name="fullName"
                placeholder="ФИО"
                autoComplete="name"
                required
              />
            </label>

            <fieldset>
              <legend>Сможете ли присутствовать на нашем торжестве?</legend>
              <label><input name="attendance" type="radio" value="Приду" required /> Я с удовольствием приду</label>
              <label><input name="attendance" type="radio" value="Не смогу" required /> К сожалению, не смогу присутствовать</label>
              <label><input name="attendance" type="radio" value="Приду с парой" required /> Буду со своей парой</label>
              <label><input name="attendance" type="radio" value="Сообщу позже" required /> Сообщу позже</label>
            </fieldset>

            <fieldset>
              <legend>Буду присутсвовать на регистрации?</legend>
              <label><input name="comeRegister" type="radio" value="Да" required /> Да</label>
              <label><input name="comeRegister" type="radio" value="Нет" required /> Нет</label>
            </fieldset>

            <fieldset>
              <legend>Нужен ли Вам трансфер от ЗАГСА?</legend>
              <label><input name="transfer" type="radio" value="Да" required /> Да</label>
              <label><input name="transfer" type="radio" value="Нет" required /> Нет</label>
            </fieldset>

            <fieldset>
              <legend>Что предпочитаете из напитков?</legend>
              {drinkOptions.map((drink) => (
                <label key={drink}>
                  <input name="drinks" type="checkbox" value={drink} /> {drink}
                </label>
              ))}
            </fieldset>

            <button type="submit" disabled={rsvpStatus === 'submitting'}>
              {rsvpStatus === 'submitting' ? 'Отправляем...' : 'Отправить'}
            </button>
            {rsvpMessage ? (
              <p
                className={`love-form__message love-form__message--${rsvpStatus}`}
                aria-live="polite"
              >
                {rsvpMessage}
              </p>
            ) : null}
          </form>
        </RevealOnScroll>
      </section>

      <section className="love-section love-countdown">
        <RevealOnScroll>
          <div className="love-frame love-frame--countdown">
            
            <h2 className='leading-18!'>ЖДЕМ ВАС<br />ЧЕРЕЗ...</h2>
            <div className="love-timer" aria-label={getCountdownAriaLabel(countdown)}>
              <CountdownItem
                value={countdown.days}
                labels={['день', 'дня', 'дней']}
                isMain
                prefersReducedMotion={shouldReduceMotion}
              />
              <CountdownItem
                value={countdown.hours}
                labels={['час', 'часа', 'часов']}
                prefersReducedMotion={shouldReduceMotion}
              />
              <CountdownItem
                value={countdown.minutes}
                labels={['минута', 'минуты', 'минут']}
                prefersReducedMotion={shouldReduceMotion}
              />
              <CountdownItem
                value={countdown.seconds}
                labels={['секунда', 'секунды', 'секунд']}
                prefersReducedMotion={shouldReduceMotion}
              />
            </div>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  )
}
