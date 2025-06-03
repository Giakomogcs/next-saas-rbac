interface SignInWithGithubRequest {
  code: string
}

interface SignInWithGithubResponse {
  token: string
}

export async function signInWithGithub({
  code,
}: SignInWithGithubRequest): Promise<SignInWithGithubResponse> {
  try {
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3333'
    const response = await fetch(`${BACKEND_URL}/sessions/github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || 'Erro ao chamar backend')
    }

    const data = (await response.json()) as SignInWithGithubResponse

    return data
  } catch (error) {
    console.error('Erro no signInWithGithub:', error)
    throw error
  }
}
