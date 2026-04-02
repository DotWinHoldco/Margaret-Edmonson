'use client'

import { useRef, useState } from 'react'

/**
 * Product card image that samples edge colors to fill the grid container seamlessly.
 * The artwork is always shown in full (object-contain) with the remaining space
 * filled by the dominant edge color of the image.
 */
export default function ProductCard({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  const [edgeColor, setEdgeColor] = useState('#FAF7F2')
  const [loaded, setLoaded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function handleLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget
    setLoaded(true)
    if (!canvasRef.current) return

    try {
      const size = 80
      const w = size
      const ratio = img.naturalWidth / img.naturalHeight
      const h = Math.round(size / ratio)
      const canvas = canvasRef.current
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(img, 0, 0, w, h)
      const data = ctx.getImageData(0, 0, w, h).data

      // Sample all four edges
      const samples: number[][] = []
      for (let x = 0; x < w; x++) {
        const tIdx = (0 * w + x) * 4
        samples.push([data[tIdx], data[tIdx + 1], data[tIdx + 2]])
        const bIdx = ((h - 1) * w + x) * 4
        samples.push([data[bIdx], data[bIdx + 1], data[bIdx + 2]])
      }
      for (let y = 0; y < h; y++) {
        const lIdx = (y * w + 0) * 4
        samples.push([data[lIdx], data[lIdx + 1], data[lIdx + 2]])
        const rIdx = (y * w + (w - 1)) * 4
        samples.push([data[rIdx], data[rIdx + 1], data[rIdx + 2]])
      }

      const avg = samples.reduce(
        (acc, c) => [acc[0] + c[0], acc[1] + c[1], acc[2] + c[2]],
        [0, 0, 0]
      )
      const n = samples.length
      setEdgeColor(`rgb(${Math.round(avg[0] / n)},${Math.round(avg[1] / n)},${Math.round(avg[2] / n)})`)
    } catch {
      setEdgeColor('#FAF7F2')
    }
  }

  return (
    <div
      className={`relative aspect-[4/5] overflow-hidden rounded-sm flex items-center justify-center transition-colors duration-500 ${className}`}
      style={{ backgroundColor: edgeColor }}
    >
      <canvas ref={canvasRef} className="hidden" />
      <img
        src={src}
        alt={alt}
        className={`absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] object-contain transition-all duration-700 group-hover:scale-[1.03] ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
        crossOrigin="anonymous"
      />
    </div>
  )
}
