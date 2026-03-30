import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'SaetaIA — Noticias de Inteligencia Artificial'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Purple glow */}
        <div
          style={{
            position: 'absolute',
            width: 700,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.35) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Title */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: 'white',
            letterSpacing: '-2px',
            marginBottom: 16,
          }}
        >
          SaetaIA
        </div>
        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: '#a1a1aa',
            marginBottom: 32,
          }}
        >
          Noticias de Inteligencia Artificial
        </div>
        {/* URL */}
        <div style={{ fontSize: 20, color: '#52525b' }}>saetaia.com</div>
      </div>
    ),
    { ...size },
  )
}
