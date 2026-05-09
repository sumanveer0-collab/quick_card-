'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Navbar from '@/components/Navbar'
import SidebarTools from '@/components/editor/SidebarTools'
import CanvasPreview from '@/components/editor/CanvasPreview'
import TopbarControls from '@/components/editor/TopbarControls'
import { useEditorStore } from '@/store/editor.store'

export default function CardEditorPage() {
  const router = useRouter()
  const { reset } = useEditorStore()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/login')
      return
    }

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        useEditorStore.getState().undo()
      }
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault()
        useEditorStore.getState().redo()
      }
      // Delete: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.ctrlKey && !e.shiftKey) {
        const selectedId = useEditorStore.getState().selectedId
        if (selectedId) {
          e.preventDefault()
          useEditorStore.getState().deleteElement(selectedId)
        }
      }
      // Duplicate: Ctrl+D
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        const selectedId = useEditorStore.getState().selectedId
        if (selectedId) {
          useEditorStore.getState().duplicateElement(selectedId)
        }
      }
      // Deselect: Escape
      if (e.key === 'Escape') {
        useEditorStore.getState().selectElement(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Top Controls Bar */}
      <TopbarControls />

      {/* Main Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools Panel */}
        <div className="w-80 flex-shrink-0 overflow-hidden">
          <SidebarTools />
        </div>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas Header */}
          <div className="bg-white border-b border-gray-100 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  title="Back"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    Professional Card Editor
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Print-ready design with 300 DPI accuracy
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">Tip:</span> Double-click text to edit
                </div>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <CanvasPreview />

          {/* Canvas Footer - Guidelines Info */}
          <div className="bg-white border-t border-gray-100 px-6 py-2">
            <div className="flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500/20 border-2 border-red-500 border-dashed rounded" />
                <span className="text-gray-600">Bleed Area (0.125″)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-gray-700 rounded" />
                <span className="text-gray-600">Trim/Cut Line (3.5″ × 2″)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-green-500 border-dashed rounded" />
                <span className="text-gray-600">Safe Area (Keep content inside)</span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <span className="text-gray-500">
                <span className="text-amber-600 font-semibold">⚠️ Warning:</span> Elements outside safe area shown in orange
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Tutorial (show on first visit) */}
      <WelcomeTutorial />
    </div>
  )
}

function WelcomeTutorial() {
  const [showTutorial, setShowTutorial] = useState(true)

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('qc_editor_tutorial_seen')
    if (hasSeenTutorial) {
      setShowTutorial(false)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem('qc_editor_tutorial_seen', 'true')
    setShowTutorial(false)
  }

  if (!showTutorial) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to the Professional Editor!
          </h2>
          <p className="text-gray-600">
            Create print-ready business cards with professional guidelines
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-2xl mb-2">🎨</div>
            <h3 className="font-semibold text-gray-900 mb-1">Add Elements</h3>
            <p className="text-xs text-gray-600">
              Add text, images, shapes from the left sidebar
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-4">
            <div className="text-2xl mb-2">✏️</div>
            <h3 className="font-semibold text-gray-900 mb-1">Edit & Style</h3>
            <p className="text-xs text-gray-600">
              Double-click text to edit, use sidebar to customize
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-4">
            <div className="text-2xl mb-2">📐</div>
            <h3 className="font-semibold text-gray-900 mb-1">Print Guidelines</h3>
            <p className="text-xs text-gray-600">
              Bleed, trim, and safe area guides for professional printing
            </p>
          </div>

          <div className="bg-amber-50 rounded-xl p-4">
            <div className="text-2xl mb-2">⌨️</div>
            <h3 className="font-semibold text-gray-900 mb-1">Shortcuts</h3>
            <p className="text-xs text-gray-600">
              Ctrl+Z undo, Ctrl+D duplicate, Del to delete
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">🎯 Print-Ready Dimensions</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• <strong>Final Card:</strong> 3.5″ × 2″ (1050 × 600px @ 300 DPI)</p>
            <p>• <strong>Bleed Area:</strong> 0.125″ extra on all sides (red dashed)</p>
            <p>• <strong>Safe Area:</strong> Keep text/logos inside green zone</p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Got it, Let's Start Creating!
        </button>
      </motion.div>
    </motion.div>
  )
}
