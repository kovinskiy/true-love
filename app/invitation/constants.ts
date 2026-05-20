/** Данные приглашения в структуре макета invitelove.ru/love_is */
export const COUPLE_TITLE = 'Егор + Вероника'

export const EVENT_DATE = {
  day: '25',
  month: '07',
  year: '26',
} as const

export const EVENT_DATE_LABEL = `${EVENT_DATE.day}.${EVENT_DATE.month}.20${EVENT_DATE.year}`
export const EVENT_DATE_TEXT = '25 июля 2026 г.'

export const VENUE = {
  name: 'Банкетный зал "Panorama Hall"',
  lines: 'п. Токсово, Полевая аллея 19 (въезд с ул. Разъезжая 15)',
  mapQuery: 'Банкетный зал "Panorama Hall" п. Токсово, Полевая аллея 19 (въезд с ул. Разъезжая 15)',
} as const

export const OPEN_ENVELOPE_MS = 1400
export const PRELOADER_MS = 400

export const MUSIC_STORAGE_KEY = 'true-love:music-enabled'

export const schedule = [
  { time: '12:40', title: 'Регистрация' },
  { time: '-', title: 'Трансфер от ЗАГСА' },
  { time: '15:00', title: 'Сбор гостей' },
  { time: '16:00', title: 'Начало банкета' },
  { time: '23:00', title: 'Завершение' },
] as const

export const dressCodeColors = [
  '#cf9495',
  '#e2b2ae',
  '#f5edbb',
  '#f0d9a7',
  '#efe2cd',
  '#d8c8b9',
  '#c5d8b0',
  '#d6e3bd',
  '#c6deee',
  '#b8c8de',
  '#d8c9e6',
] as const
