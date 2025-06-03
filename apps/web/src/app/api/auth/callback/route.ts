import { signInWithGithub } from '@/http/sign-in-with-github'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { message: 'Github OAuth code was not found.' },
      { status: 400 }
    )
  }

  try {
    const { token } = await signInWithGithub({ code })

    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return response
  } catch (error) {
    console.error('Erro ao autenticar com GitHub:', error)
    return NextResponse.json(
      { message: 'Erro ao autenticar com GitHub' },
      { status: 500 }
    )
  }
}
