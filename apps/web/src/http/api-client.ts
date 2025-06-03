import ky from 'ky'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3333'

export const api = ky.create({
  prefixUrl: BACKEND_URL,
})
