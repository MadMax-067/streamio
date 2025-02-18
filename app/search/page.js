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
                  <div className="relative w-6 h-6">  {/* Fixed size container */}
                    <Image
                      src={result.channel.avatar}
                      alt={result.channel.username}
                      fill
                      className="rounded-full object-cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
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
    if (!backendData.isLoggedIn) {
        router.push('/welcome')
    }
}, [backendData.isLoggedIn, router])

if (!backendData.isLoggedIn) return <div className='min-h-screen'></div>
  
  return (
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center'><Loading /></div>}>
      <SearchContent />
      <div className="md:hidden">
        <BottomBar />
      </div>
    </Suspense>
  )
}