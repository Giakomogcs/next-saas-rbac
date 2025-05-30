// auth-cookie.ts (server-only)
'use server'
import { cookies } from 'next/headers'

export async function setTokenCookie(token: string) {
  ;(await cookies()).set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  })
}
