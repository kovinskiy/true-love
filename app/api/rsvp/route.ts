type RsvpPayload = {
  fullName?: unknown
  attendance?: unknown
  transfer?: unknown
  drinks?: unknown
  comeRegister?: unknown
}

const WIKI_API_BASE = 'https://api.wiki.yandex.net/v1'

const getRequiredEnv = (name: string) => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing ${name}`)
  }

  return value
}

const getTextValue = (value: unknown) => {
  return typeof value === 'string' ? value.trim() : ''
}

const getTextListValue = (value: unknown) => {
  if (!Array.isArray(value)) return ''

  return value
    .map(getTextValue)
    .filter(Boolean)
    .join(', ')
}

export async function POST(request: Request) {
  let payload: RsvpPayload

  try {
    payload = (await request.json()) as RsvpPayload
  } catch {
    return Response.json({ message: 'Некорректные данные формы.' }, { status: 400 })
  }

  const fullName = getTextValue(payload.fullName)
  const attendance = getTextValue(payload.attendance)
  const transfer = getTextValue(payload.transfer)
  const drinks = getTextListValue(payload.drinks)
  const comeRegister = getTextValue(payload.comeRegister)

  if (!fullName || !attendance || !transfer || !comeRegister) {
    return Response.json({ message: 'Заполните все поля формы.' }, { status: 400 })
  }

  try {
    const token = getRequiredEnv('YANDEX_WIKI_TOKEN')
    const orgId = getRequiredEnv('YANDEX_WIKI_ORG_ID')
    const gridId = getRequiredEnv('YANDEX_WIKI_GRID_ID')
    const authScheme = process.env.YANDEX_WIKI_AUTH_SCHEME || 'OAuth'
    const orgHeader = process.env.YANDEX_WIKI_ORG_HEADER || 'X-Org-Id'

    const response = await fetch(`${WIKI_API_BASE}/grids/${gridId}/rows`, {
      method: 'POST',
      headers: {
        Authorization: `${authScheme} ${token}`,
        [orgHeader]: orgId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rows: [
          {
            submitted_at: new Date().toISOString(),
            full_name: fullName,
            attendance,
            transfer,
            drinks,
            come_register: comeRegister,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Yandex Wiki RSVP error:', response.status, errorText)

      return Response.json(
        { message: 'Не удалось отправить ответ. Попробуйте позже.' },
        { status: 502 }
      )
    }

    return Response.json({ message: 'Ответ отправлен.' })
  } catch (error) {
    console.error('RSVP route error:', error)

    return Response.json(
      { message: 'Отправка пока не настроена на сервере.' },
      { status: 500 }
    )
  }
}
