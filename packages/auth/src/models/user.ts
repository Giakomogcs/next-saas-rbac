import { z } from 'zod'
import { Role, roleSchema } from '../roles'

export const userSchema = z.object({
  role: roleSchema,
})

export type User = z.infer<typeof userSchema>
