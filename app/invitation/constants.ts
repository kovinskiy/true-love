/** Данные приглашения в структуре макета invitelove.ru/love_is */
export const COUPLE_TITLE = 'Егор + Вероника'

export const EVENT_DATE = {
  day: '19',
  month: '07',
  year: '26',
} as const

export const EVENT_DATE_LABEL = `${EVENT_DATE.day}.${EVENT_DATE.month}.20${EVENT_DATE.year}`
export const EVENT_DATE_TEXT = '19 июля 2026 г.'

export const VENUE = {
  name: 'Ресторан «Ruski»',
  lines: ['1-й Красногвардейский пр., 21,', 'стр. 2, Москва'],
  mapQuery: 'Ресторан Ruski, 1-й Красногвардейский проезд, 21, стр. 2, Москва',
} as const

export const OPEN_ENVELOPE_MS = 1400
export const PRELOADER_MS = 400

export const MUSIC_STORAGE_KEY = 'true-love:music-enabled'

export const schedule = [
  { time: '15:30', title: 'Фуршет' },
  { time: '16:00', title: 'Церемония' },
  { time: '17:00', title: 'Свадебный ужин' },
  { time: '21:45', title: 'Торт' },
  { time: '23:00', title: 'Завершение' },
] as const

export const dressCodeColors = [
  '#cf9495',
  '#f5edbb',
  '#efe2cd',
  '#c5d8b0',
  '#c6deee',
] as const
