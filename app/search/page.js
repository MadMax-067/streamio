"use client"
import { Suspense, useEffect, useState, useRef, useContext } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import BottomBar from '@/components/BottomBar'
import { useSearchParams, useRouter } from 'next/navigation'
import Loading from '@/components/Loading'
import { BackendContext } from '@/components/Providers'
import { motion, AnimatePresence } from "framer-motion"
import SignUp from '@/components/SignUp'
import Login from '@/components/Login'
import { Button } from '@/components/ui/button'
import SearchSkeleton from '@/components/SearchSkeleton'
import NoResults from '@/components/NoResults'
import AuthCheck from '@/components/AuthCheck'
import { Space_Grotesk } from 'next/font/google'
import localFont from 'next/font/local'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })
const mercenary = localFont({ src: '../../fonts/mercenaryBold.otf' })

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
        if (err.response?.status === 404) {
          setResults([])
        } else {
          setError(err.message)
        }
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

  if (loading) return (
    <div className="min-h-screen p-4 md:p-8 pb-20 md:pb-8">
      <div className="skeleton h-8 w-64 rounded mb-6" />
      {[1, 2, 3, 4].map((i) => (
        <SearchSkeleton key={i} />
      ))}
    </div>
  )
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p>{error}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-4 md:p-8 pb-20 md:pb-8 ${spaceGrotesk.className}`}>
      <h1 className={`${mercenary.className} text-3xl md:text-4xl mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text`}>
        Search results for: {query}
      </h1>
      <div className="space-y-6">
        {results.map((result) => (
          result.type === 'channel' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={result._id}
            >
              <Link
                href={`/profile/${result.username}`}
                className="flex items-center gap-4 p-6 hover:bg-gray-800/50 rounded-xl transition-all duration-200 border border-gray-800/50 backdrop-blur-sm"
              >
                <div className="relative w-20 h-20">  {/* Fixed size container */}
                  <Image
                    src={result.avatar}
                    alt={result.username}
                    fill
                    className="rounded-full object-cover"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-100">{result.fullName}</h3>
                  <p className="text-blue-400">@{result.username}</p>
                  <p className="text-sm text-gray-400 mt-1">{result.subscribersCount} subscribers</p>
                </div>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={result._id}
            >
              <Link
                href={`/video/${result._id}`}
                className="flex flex-col md:flex-row gap-6 hover:bg-gray-800/50 rounded-xl transition-all duration-200 p-6 border border-gray-800/50 backdrop-blur-sm"
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
                  <h3 className="text-xl font-semibold text-gray-100 line-clamp-2">{result.title}</h3>
                  <div className="flex items-center gap-3 mt-3">
                    <Link 
                      href={`/profile/${result.channel.username}`}
                      className="flex items-center gap-3 hover:text-blue-400 transition-colors"
                      onClick={(e) => e.stopPropagation()} // Prevent video link from triggering
                    >
                      <div className="relative w-6 h-6">
                        <Image
                          src={result.channel.avatar}
                          alt={result.channel.username}
                          fill
                          className="rounded-full object-cover"
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                      <p className="text-blue-400 hover:text-blue-300">{result.channel.username}</p>
                    </Link>
                  </div>
                  <div className="flex gap-3 text-sm text-gray-400 mt-2">
                    <span>{result.views} views</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(result.createdAt))} ago</span>
                  </div>
                  <p className="text-gray-300 mt-3 line-clamp-2">{result.description}</p>
                </div>
              </Link>
            </motion.div>
          )
        ))}

        {results.length === 0 && query && (
          <NoResults query={query} />
        )}

        {!query && (
          <div className="text-center text-gray-500">
            Start typing to search...
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  const router = useRouter()
  const backendData = useContext(BackendContext)
  
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
  
  return (
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center'><Loading /></div>}>
      <SearchContent />
      <div className="md:hidden">
        <BottomBar />
      </div>
    </Suspense>
  )
}