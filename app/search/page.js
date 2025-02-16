"use client"
import { Suspense, useEffect, useState, useRef, useContext } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import BottomBar from '@/components/BottomBar'
import { useSearchParams } from 'next/navigation'
import Loading from '@/components/Loading'
import { BackendContext } from '@/components/Providers'
import { motion, AnimatePresence } from "framer-motion"
import SignUp from '@/components/SignUp'
import Login from '@/components/Login'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

function SearchContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch search results whenever 'query' changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return
      try {
        setLoading(true)
        const response = await axios.get(`/api/global-search?search=${encodeURIComponent(query)}`)
        setResults(response.data.data.results)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [query])

  // Update query state whenever the searchParams change
  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>

  return (
    <div className="min-h-screen p-4 md:p-8 pb-20 md:pb-8">
      <h1 className="text-2xl mb-6">Search results for: {query}</h1>
      <div className="space-y-6">
        {results.map((result) => (
          result.type === 'channel' ? (
            // Channel Result
            <Link
              href={`/profile/${result.username}`}
              key={result._id}
              className="flex items-center gap-4 p-4 hover:bg-gray-800/50 rounded-lg transition"
            >
              <Image
                src={result.avatar}
                alt={result.username}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold">{result.fullName}</h3>
                <p className="text-gray-400">@{result.username}</p>
                <p className="text-sm text-gray-500">{result.subscribersCount} subscribers</p>
              </div>
            </Link>
          ) : (
            // Video Result
            <Link
              href={`/video/${result._id}`}
              key={result._id}
              className="flex flex-col md:flex-row gap-4 hover:bg-gray-800/50 rounded-lg transition p-4"
            >
              <div className="relative w-full md:w-64 aspect-video">
                <Image
                  src={result.thumbnail}
                  alt={result.title}
                  fill
                  className="object-cover rounded-lg"
                />
                <span className="absolute bottom-1 right-1 bg-black/80 px-2 py-1 text-xs rounded">
                  {Math.floor(result.duration)}:{((result.duration % 1) * 60).toFixed(0).padStart(2, '0')}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold line-clamp-2">{result.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Image
                    src={result.channel.avatar}
                    alt={result.channel.username}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <p className="text-gray-400">{result.channel.username}</p>
                </div>
                <div className="flex gap-2 text-sm text-gray-500 mt-1">
                  <span>{result.views} views</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(result.createdAt))} ago</span>
                </div>
                <p className="text-gray-400 mt-2 line-clamp-2">{result.description}</p>
              </div>
            </Link>
          )
        ))}

        {results.length === 0 && (
          <div className="text-center text-gray-500">
            No results found for "{query}"
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchResults() {
  const backendData = useContext(BackendContext)
  const loginRef = useRef(null)
  const signUpRef = useRef(null)

  const handleClickOutside = (event) => {
    if (loginRef.current && !loginRef.current.contains(event.target)) {
      backendData.setIsLogging(false)
    }
    if (signUpRef.current && !signUpRef.current.contains(event.target)) {
      backendData.setIsRegistering(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!backendData.isLoggedIn) {
    return (
      <>
        <AnimatePresence>
          {backendData.isLogging && (
            <motion.div
              ref={loginRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixedBox'
            >
              <Login />
            </motion.div>
          )}
          {backendData.isRegistering && (
            <motion.div
              ref={signUpRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixedBox'
            >
              <SignUp />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
          <h1 className="text-2xl font-bold mb-4">Please login to search videos</h1>
          <div className="flex gap-4">
            <Button
              onClick={backendData.onLoginClick}
              className="btn min-h-0 btn-accent text-secondary/70 md:rounded-[0.85rem] border-secondary/30"
            >
              Login
            </Button>
            <Button
              onClick={backendData.onSignupClick}
              className="btn min-h-0 btn-primary text-secondary md:rounded-[0.85rem]"
            >
              Sign up
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center'><Loading /></div>}>
      <SearchContent />
      <div className="md:hidden">
        <BottomBar />
      </div>
    </Suspense>
  )
}