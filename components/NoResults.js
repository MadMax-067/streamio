import React from 'react'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'

const NoResults = ({ query }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[50vh] p-4"
    >
      <div className="relative mb-6">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Search size={64} className="text-gray-500" />
        </motion.div>
        <motion.div
          className="absolute -bottom-2 w-16 h-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent"
          animate={{
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-300 mb-2 text-center">
        No results found
      </h2>
      <p className="text-gray-500 text-center max-w-md">
        We couldn't find any matches for "<span className="text-blue-400">{query}</span>"
      </p>
      <div className="mt-6 text-gray-400 text-sm">
        Suggestions:
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Make sure all words are spelled correctly</li>
          <li>Try different keywords</li>
          <li>Try more general keywords</li>
        </ul>
      </div>
    </motion.div>
  )
}

export default NoResults