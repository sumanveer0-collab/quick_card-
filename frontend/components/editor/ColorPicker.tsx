'use client'

import BackgroundColorPicker from '@/components/shared/BackgroundColorPicker'
import { ColorPickerProps } from '@/types/fabric.types'

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <BackgroundColorPicker
      value={color}
      onChange={onChange}
      title="Background color"
      showGradients
    />
  )
}
