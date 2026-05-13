'use client'

import type { FormEvent, KeyboardEvent } from 'react'
import { useState } from 'react'
import {
  COUPLE_TITLE,
  dressCodeColors,
  EVENT_DATE_LABEL,
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
  'Обратите внимание, что формат мероприятия не предполагает детской площадки и аниматоров. Пожалуйста, позаботьтесь о том, чтобы провести этот вечер без детей.',
  'Будем признательны за альтернативу букетам в форме бутылочки вина или другого приятного напитка и записки о событии, к которому приурочить ее открытие.',
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

export const InvitationBody = ({
  mapHref,
  musicLabel,
  isMusicEnabled,
  isMusicPlaying,
  isMusicAvailable,
  onToggleMusic,
}: InvitationBodyProps) => {
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
            <h1>НАША СВАДЬБА</h1>
            <div className="love-heart" aria-hidden="true">♥</div>
            <p className="love-date">{EVENT_DATE_LABEL}</p>
            <div className="love-couple">
              <img src="/images/egor.png" alt="Саша" />
              <img src="/images/veronika.png" alt="Катя" />
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
              <h2>ДОРОГИЕ<br />РОДНЫЕ<br />И ДРУЗЬЯ!</h2>
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
              <div className="ring-box" aria-hidden="true">
                <span />
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section className="love-section love-where">
        <RevealOnScroll>
          <div className="love-where__grid">
            <div>
              <h2>Когда?</h2>
              <p>Будем рады видеть Вас</p>
              <p>{EVENT_DATE_TEXT}</p>
            </div>
            <div>
              <h2>Где?</h2>
              <p>{VENUE.name}</p>
              <p>{VENUE.lines[0]}<br />{VENUE.lines[1]}</p>
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
                      <div className="love-guests" aria-hidden="true" />
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
            </fieldset>

            <fieldset>
              <legend>Нужен ли Вам трансфер?</legend>
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
            <div className="ring-box ring-box--large" aria-hidden="true">
              <span />
            </div>
            <h2>ЖДЕМ ВАС<br />ЧЕРЕЗ...</h2>
            <div className="love-timer" aria-label="До свадьбы осталось 67 дней 2 часа 45 минут 18 секунд">
              <div className="love-timer__item love-timer__item--main">
                <strong>67</strong>
                <span>дней</span>
              </div>
              <div className="love-timer__item">
                <strong>2</strong>
                <span>часов</span>
              </div>
              <div className="love-timer__item">
                <strong>45</strong>
                <span>минут</span>
              </div>
              <div className="love-timer__item">
                <strong>18</strong>
                <span>секунд</span>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  )
}
