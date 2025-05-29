import { FormEvent, useState, useTransition } from 'react'

interface FormState {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

export function useFormState(
  action: (data: FormData) => Promise<FormState>,
  initialState?: FormState
) {
  const [isPending, startTransiction] = useTransition()

  const [FormState, setFormstate] = useState(
    initialState ?? {
      success: false,
      message: null,
      errors: null,
    }
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    startTransiction(async () => {
      const state = await action(data)
      setFormstate(state)
    })
  }

  return [FormState, handleSubmit, isPending] as const
}
