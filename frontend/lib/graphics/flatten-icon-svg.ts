/** Strip white from icon SVGs so they render as flat single-color glyphs. */
export function flattenIconSvg(svg: string, color = 'currentColor'): string {
  const strokeColor = color === 'currentColor' ? 'currentColor' : color
  let result = svg
    .replace(/\sfill=["']white["']/gi, ' fill="none"')
    .replace(/\sfill=["']#fff(?:fff)?["']/gi, ' fill="none"')
    .replace(/\sstroke=["']white["']/gi, ` stroke="${strokeColor}"`)
    .replace(/\sstroke=["']#fff(?:fff)?["']/gi, ` stroke="${strokeColor}"`)

  if (color !== 'currentColor') {
    result = result.replace(/currentColor/g, color)
  }
  return result
}
