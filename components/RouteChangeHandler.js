"use client"
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default function RouteChangeHandler() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    NProgress.configure({ showSpinner: false })
  }, [])

  useEffect(() => {
    NProgress.start()
    NProgress.done()
  }, [pathname, searchParams])

  return null
}