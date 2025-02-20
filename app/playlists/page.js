"use client"
import { useState, useEffect, useContext } from 'react'
import { Space_Grotesk } from 'next/font/google'
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from 'next/navigation'
import { BackendContext } from '@/components/Providers'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

const PlaylistCard = ({ playlist, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all"
    >
      <Link href={`/playlists/${playlist._id}`}>
        <div className="grid grid-cols-2 gap-1 p-1">
          {playlist.videos.slice(0, 4).map((videoId, index) => (
            <div key={videoId} className="aspect-video bg-gray-900/50" />
          ))}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg mb-1">{playlist.name}</h3>
          <p className="text-sm text-gray-400 line-clamp-2">{playlist.description}</p>
          <p className="text-xs text-gray-500 mt-2">{playlist.videos.length} videos</p>
        </div>
      </Link>
      {playlist.name !== "Watch Later" && (
        <div className="px-4 pb-4 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={() => onEdit(playlist)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-500"
            onClick={() => onDelete(playlist._id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </motion.div>
  )
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingPlaylist, setEditingPlaylist] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const router = useRouter()
  const backendData = useContext(BackendContext)

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('/api/playlist/user')
      setPlaylists(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch playlists')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!backendData.isAuthChecking && !backendData.isLoggedIn) {
      router.replace('/welcome')
      return
    }
    fetchPlaylists()
  }, [backendData.isAuthChecking, backendData.isLoggedIn, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPlaylist) {
        await axios.patch(`/api/playlist/${editingPlaylist._id}`, formData)
        toast.success('Playlist updated')
      } else {
        await axios.post('/api/playlist', formData)
        toast.success('Playlist created')
      }
      fetchPlaylists()
      setShowDialog(false)
      setFormData({ name: '', description: '' })
      setEditingPlaylist(null)
    } catch (error) {
      toast.error(editingPlaylist ? 'Failed to update playlist' : 'Failed to create playlist')
    }
  }

  const handleEdit = (playlist) => {
    setEditingPlaylist(playlist)
    setFormData({ name: playlist.name, description: playlist.description })
    setShowDialog(true)
  }

  const handleDelete = async (playlistId) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return
    try {
      await axios.delete(`/api/playlist/${playlistId}`)
      toast.success('Playlist deleted')
      fetchPlaylists()
    } catch (error) {
      toast.error('Failed to delete playlist')
    }
  }

  if (backendData.isAuthChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen pb-20 md:pb-0 ${spaceGrotesk.className}`}>
      <div className="px-4 md:container md:mx-auto py-4 md:py-6">
        <div className="flex flex-col max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faFolderOpen} className="w-6 h-6 text-gray-400" />
              <h1 className="text-2xl md:text-3xl font-bold">Your Playlists</h1>
            </div>
            <Button
              onClick={() => {
                setEditingPlaylist(null)
                setFormData({ name: '', description: '' })
                setShowDialog(true)
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Create Playlist</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist._id}
                playlist={playlist}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-200">
              {editingPlaylist ? 'Edit Playlist' : 'Create Playlist'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-gray-200"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingPlaylist ? 'Save Changes' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}