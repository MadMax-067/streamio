import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Play, Pause, Volume2, VolumeX, Maximize2,
  SkipBack, SkipForward, Settings
} from 'lucide-react'
import { Button } from './ui/button'
import { Slider } from './ui/slider'

export default function VideoPlayerControls({
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
  const [hovering, setHovering] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    let timer
    if (!hovering && playing) {
      timer = setTimeout(() => setShowControls(false), 2000)
    }
    return () => clearTimeout(timer)
  }, [hovering, playing])

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
      onMouseEnter={() => {
        setHovering(true)
        setShowControls(true)
      }}
      onMouseLeave={() => setHovering(false)}
      onTouchStart={() => {
        setShowControls(true)
        setHovering(true)
      }}
      onTouchEnd={() => setHovering(false)}
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
            {/* Progress Bar */}
            <div className="relative group">
              <Slider
                value={[played]}
                max={1}
                step={0.001}
                onValueChange={onSeek}
                className="cursor-pointer"
              />
              <motion.div
                className="absolute -top-8 left-0 bg-black/80 px-2 py-1 rounded text-xs transform -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${played * 100}%` }}
              >
                {formatTime(played * duration)}
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPlayPause}
                  className="hover:bg-white/10 transition-colors"
                >
                  {playing ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>

                <div className="flex items-center group relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleMute}
                    className="hover:bg-white/10 transition-colors"
                  >
                    {muted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </Button>
                  <div className="w-0 overflow-hidden group-hover:w-24 transition-all duration-300">
                    <Slider
                      value={[muted ? 0 : volume]}
                      max={1}
                      step={0.1}
                      onValueChange={onVolumeChange}
                      className="ml-2"
                    />
                  </div>
                </div>

                <span className="text-sm">
                  {formatTime(played * duration)} / {formatTime(duration)}
                </span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 min-w-[200px]"
                    >
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-400 mb-2">Playback Speed</p>
                          <div className="grid grid-cols-4 gap-1">
                            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                              <button
                                key={speed}
                                onClick={() => setPlaybackSpeed(speed)}
                                className={`px-2 py-1 text-xs rounded ${
                                  playbackSpeed === speed
                                    ? 'bg-blue-600'
                                    : 'hover:bg-white/10'
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
                                    quality === q
                                      ? 'bg-blue-600'
                                      : 'hover:bg-white/10'
                                  }`}
                                >
                                  {q}p
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(!showSettings)}
                  className="hover:bg-white/10 transition-colors relative"
                >
                  <Settings className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleFullscreen}
                  className="hover:bg-white/10 transition-colors"
                >
                  <Maximize2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}