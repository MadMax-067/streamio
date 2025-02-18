"use client"
import Loading from '@/components/Loading'
import { Suspense, lazy, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { BackendContext } from '@/components/Providers'

const Main = lazy(() => import('@/components/Main'))

export const dynamic = 'force-dynamic'

export default function Home() {
  const backendData = useContext(BackendContext)
  const router = useRouter()

  useEffect(() => {
    // Only redirect if we're sure the user is not logged in
    if (!backendData.isAuthChecking && !backendData.isLoggedIn) {
      router.replace('/welcome')
    }
  }, [backendData.isAuthChecking, backendData.isLoggedIn, router])

  // Show loading state while checking auth
  if (backendData.isAuthChecking) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  // Redirect if not logged in
  if (!backendData.isLoggedIn) {
    return null
  }

  return (
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center'><Loading /></div>}>
      <Main BACKEND_API={process.env.BACKEND_API} />
    </Suspense>
  )
}
