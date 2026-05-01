import { z } from 'zod'

export function zodErrorsToRecord(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}
  error.errors.forEach((err) => {
    const key = err.path.join('.')
    errors[key] = err.message
  })
  return errors
}
