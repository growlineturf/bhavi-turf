import { z } from 'zod'

export const contactSchema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters').max(100),
  email:   z.string().email('Please enter a valid email address'),
  subject: z.string().max(200).optional(),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000),
})

export type ContactInput = z.infer<typeof contactSchema>
