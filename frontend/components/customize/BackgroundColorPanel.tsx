'use client'

import { useCallback } from 'react'
import { useEditorStore } from '@/store/editor.store'
import BackgroundColorPicker from '@/components/shared/BackgroundColorPicker'
import { isGradientBackground } from '@/lib/background-palette'
import { CARD_WIDTH_PX, CARD_HEIGHT_PX, BLEED_PX } from '@/store/editor.store'

/** Update a full-card base shape so template designs reflect the new background. */
function syncBaseCardShape(color: string) {
  if (isGradientBackground(color)) return

  const { elements, updateElement } = useEditorStore.getState()
  const minW = CARD_WIDTH_PX - 20
  const minH = CARD_HEIGHT_PX - 20

  const base = elements
    .filter(el => {
      if (el.type !== 'shape' || el.visible === false) return false
      const w = el.width ?? 0
      const h = el.height ?? 0
      const coversCard = w >= minW && h >= minH
      const atOrigin = el.x <= BLEED_PX + 5 && el.y <= BLEED_PX + 5
      return coversCard || (atOrigin && w >= minW * 0.85)
    })
    .sort((a, b) => a.zIndex - b.zIndex)[0]

  if (base) updateElement(base.id, { fill: color })
}

export default function BackgroundColorPanel() {
  const { background, setBackground } = useEditorStore()

  const handleChange = useCallback((color: string) => {
    setBackground(color)
    if (!isGradientBackground(color)) {
      syncBaseCardShape(color)
    }
  }, [setBackground])

  return (
    <BackgroundColorPicker
      value={background}
      onChange={handleChange}
      title="Background color"
      showGradients
    />
  )
}
