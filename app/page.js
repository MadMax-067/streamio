"use client"
import { Suspense, lazy } from 'react'

const Main = lazy(() => import('@/components/Main'))

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <Suspense fallback={<div className='min-h-screen' >Loading...</div>}>
      <Main BACKEND_API={process.env.BACKEND_API} />
    </Suspense>
  )
}
