"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function VideoPlayerSettings({
  playing,
  played,
  volume,
  muted,
  duration,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  playbackSpeed,
  setPlaybackSpeed,
  quality,
  qualities,
  onQualityChange
}) {
  const [showControls, setShowControls] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [touching, setTouching] = useState(false)

  // Auto-hide controls
  useEffect(() => {
    let timer
    if (playing && !touching && !showSettings) {
      timer = setTimeout(() => setShowControls(false), 3000)
    }
    return () => clearTimeout(timer)
  }, [playing, touching, showSettings])

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div
      className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => !touching && playing && setShowControls(false)}
      onTouchStart={() => {
        setTouching(true)
        setShowControls(true)
      }}
      onTouchEnd={() => setTouching(false)}
    >
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 p-4 space-y-4"
          >
            {/* Progress bar */}
            <div className="relative group">
              <input
                type="range"
                min={0}
                max={1}
                step="any"
                value={played}
                onChange={(e) => onSeek([parseFloat(e.target.value)])}
                className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${played * 100}%, rgb(75 85 99) ${played * 100}%, rgb(75 85 99) 100%)`
                }}
              />
              <div className="absolute -top-8 left-0 bg-black/80 px-2 py-1 rounded text-xs transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ left: `${played * 100}%` }}
              >
                {formatTime(played * duration)}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={onPlayPause}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                {playing ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              <div className="flex items-center group">
                <button
                  onClick={onToggleMute}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  {muted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <div className="w-0 overflow-hidden group-hover:w-24 transition-all duration-300">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={muted ? 0 : volume}
                    onChange={(e) => onVolumeChange([parseFloat(e.target.value)])}
                    className="ml-2"
                  />
                </div>
              </div>

              <span className="text-sm">
                {formatTime(played * duration)} / {formatTime(duration)}
              </span>

              <div className="ml-auto flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  
                  <AnimatePresence>
                    {showSettings && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute bottom-full right-0 mb-2 p-4 bg-black/90 rounded-lg min-w-[200px] space-y-4"
                      >
                        <div>
                          <p className="text-xs text-gray-400 mb-2">Speed</p>
                          <div className="grid grid-cols-4 gap-1">
                            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                              <button
                                key={speed}
                                onClick={() => setPlaybackSpeed(speed)}
                                className={`px-2 py-1 text-xs rounded ${
                                  playbackSpeed === speed ? 'bg-blue-600' : 'hover:bg-white/10'
                                }`}
                              >
                                {speed}x
                              </button>
                            ))}
                          </div>
                        </div>
                        {qualities?.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-400 mb-2">Quality</p>
                            <div className="space-y-1">
                              {qualities.map((q) => (
                                <button
                                  key={q}
                                  onClick={() => onQualityChange(q)}
                                  className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                                    quality === q ? 'bg-blue-600' : 'hover:bg-white/10'
                                  }`}
                                >
                                  {q}p
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={onToggleFullscreen}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}