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
    // Handle all navigation in one place
    if (!backendData.isAuthChecking && !backendData.isLoggedIn) {
      router.replace('/welcome')
    }
  }, [backendData.isAuthChecking, backendData.isLoggedIn, router])

  // Show loading while checking auth
  if (backendData.isAuthChecking) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  // If not logged in, show loading while redirecting
  if (!backendData.isLoggedIn) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  // If we reach here, user is logged in
  return (
    <Suspense fallback={
      <div className='min-h-screen flex items-center justify-center'>
        <Loading />
      </div>
    }>
      <Main BACKEND_API={process.env.BACKEND_API} />
    </Suspense>
  )
}
