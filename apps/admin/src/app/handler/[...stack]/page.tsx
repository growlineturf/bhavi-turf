import { notFound } from 'next/navigation'
import { StackHandler } from '@stackframe/stack'
import { stackServerApp } from '@/stack'

export default function Handler(props: {
  params: Promise<{ stack: string[] }>
  searchParams: Promise<Record<string, string>>
}) {
  // Auth disabled for local dev — there are no sign-in pages to render.
  if (!stackServerApp) notFound()
  return <StackHandler fullPage app={stackServerApp} routeProps={props} />
}
