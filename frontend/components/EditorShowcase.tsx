'use client'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Palette, Layers, Grid, Eye } from 'lucide-react'
import Link from 'next/link'

export default function EditorShowcase() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            NEW: Professional Editor
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            VistaPrint-Level Card Editor
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create stunning business cards with our professional drag-and-drop editor.
            Full control, real-time preview, print-ready output.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Palette,
              title: 'Visual Customization',
              description: 'Drag, resize, and style every element. Change colors, fonts, and layouts in real-time.',
              color: 'from-blue-500 to-cyan-500',
            },
            {
              icon: Layers,
              title: 'Layer Management',
              description: 'Professional layer controls. Bring forward, send backward, lock elements, and more.',
              color: 'from-purple-500 to-pink-500',
            },
            {
              icon: Grid,
              title: 'Print Guidelines',
              description: 'Bleed area, trim lines, and safety zones. Export print-ready PDFs with crop marks.',
              color: 'from-orange-500 to-red-500',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12"
        >
          <div className="grid md:grid-cols-2">
            {/* Left: Features List */}
            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Everything You Need
              </h3>
              <div className="space-y-4">
                {[
                  'Drag & drop elements',
                  'Text, images, shapes',
                  'Advanced color picker',
                  'Gradient backgrounds',
                  'Snap to grid',
                  'Undo/Redo history',
                  'Zoom controls (50-200%)',
                  'Export PNG & PDF',
                  'Keyboard shortcuts',
                  'Print-ready output',
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Visual Preview */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 md:p-12 flex items-center justify-center">
              <div className="relative">
                {/* Mock editor interface */}
                <div className="bg-white rounded-2xl shadow-2xl p-4 w-80">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-6 aspect-[3.5/2] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800 mb-2">Your Business</div>
                      <div className="text-sm text-gray-600">Professional Card</div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="flex-1 h-8 bg-gray-100 rounded-lg" />
                    <div className="flex-1 h-8 bg-gray-100 rounded-lg" />
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3"
                >
                  <Zap className="w-6 h-6 text-yellow-500" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3"
                >
                  <Eye className="w-6 h-6 text-blue-500" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/card-editor"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-5 h-5" />
            Try Professional Editor
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Free to use • Export anytime
          </p>
        </motion.div>
      </div>
    </section>
  )
}
