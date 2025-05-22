import { api } from './api-client'

interface SignInWithPassordRequest {
  email: string
  password: string
}
interface SignInWithPassordResponse {
  token: string
}

export async function signInWithPassord({
  email,
  password,
}: SignInWithPassordRequest) {
  const result = await api
    .post('sessions/password', {
      json: {
        email,
        password,
      },
    })
    .json<SignInWithPassordResponse>()
}
