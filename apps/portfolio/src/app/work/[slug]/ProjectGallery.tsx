'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { useState } from 'react'

type Props = {
  title: string
  images?: string[]
  placeholders?: number
}

const isVideo = (url: string) => /\.(mp4|webm|mov)(\?|#|$)/i.test(url)

export default function ProjectGallery({ title, images = [], placeholders = 3 }: Props) {
  const slides = images.length ? images : Array.from({ length: Math.max(placeholders, 1) })
  const [index, setIndex] = useState(0)
  const count = slides.length

  const go = (next: number) => setIndex((next + count) % count)

  const initials =
    title
      .split(/[\s—-]+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'PR'

  return (
    <div className="gallery">
      <div className="gallery-stage">
        {images.length ? (
          isVideo(images[index]) ? (
            <video
              key={index}
              src={images[index]}
              className="gallery-media"
              controls
              playsInline
              preload="metadata"
            />
          ) : (
            <Image
              key={index}
              src={images[index]}
              alt={`${title} screenshot ${index + 1}`}
              fill
              sizes="(max-width: 1000px) 100vw, 1000px"
              priority={index === 0}
            />
          )
        ) : (
          <div className="gallery-ph">
            <ImageIcon size={30} />
            <span className="gallery-ph-mark">{initials}</span>
            <span className="gallery-ph-label">Preview {index + 1}</span>
          </div>
        )}

        {count > 1 ? (
          <>
            <button type="button" className="gallery-nav prev" onClick={() => go(index - 1)} aria-label="Previous image">
              <ChevronLeft size={22} />
            </button>
            <button type="button" className="gallery-nav next" onClick={() => go(index + 1)} aria-label="Next image">
              <ChevronRight size={22} />
            </button>
          </>
        ) : null}

        <span className="gallery-counter">
          {index + 1} / {count}
        </span>
      </div>

      {count > 1 ? (
        <div className="gallery-dots" role="tablist" aria-label="Gallery navigation">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to image ${i + 1}`}
              className={`gallery-dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
