import { z } from 'zod'

export const chatMessageSchema = z.object({
  message:   z.string().min(1).max(1000),
  sessionId: z.string().min(1).max(128),
  history: z.array(
    z.object({
      role:    z.enum(['user', 'assistant']),
      content: z.string().max(2000),
    })
  ).max(20).optional().default([]),
})

export type ChatMessageInput = z.infer<typeof chatMessageSchema>
