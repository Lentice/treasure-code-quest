import { useId } from 'react'
import './chest.css'

export default function Chest({ progress, glow, embedded = false, caption }) {
  const safe = Math.min(1, Math.max(0, Number(progress) || 0))
  const clipId = useId()

  const wrapClass = `chestWrap${glow ? ' chestGlow' : ''}${embedded ? ' chestWrapEmbedded' : ''}`
  const captionText = caption === undefined ? `進度：${Math.round(safe * 100)}%` : caption

  return (
    <div className={wrapClass}>
      <svg
        className="chestSvg"
        viewBox="0 0 320 220"
        role="img"
        aria-label="寶箱進度"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={320 * safe} height="220" />
          </clipPath>

          <linearGradient id="metal" x1="0" x2="1">
            <stop offset="0" stopColor="#f0f3ff" />
            <stop offset="1" stopColor="#a7b2ff" />
          </linearGradient>

          <linearGradient id="wood" x1="0" x2="1">
            <stop offset="0" stopColor="#ffcd6b" />
            <stop offset="1" stopColor="#ff5cd1" />
          </linearGradient>

          <linearGradient id="wood2" x1="0" x2="1">
            <stop offset="0" stopColor="#6b5cff" />
            <stop offset="1" stopColor="#27c36a" />
          </linearGradient>
        </defs>

        <g opacity="0.92">
          <rect x="38" y="74" width="244" height="118" rx="18" fill="#c8c8c8" />
          <rect x="38" y="74" width="244" height="118" rx="18" fill="#6b6b6b" opacity="0.25" />
          <rect x="52" y="90" width="216" height="86" rx="14" fill="#7b7b7b" opacity="0.2" />

          <path
            d="M52 78c0-26 34-46 108-46s108 20 108 46v16H52V78z"
            fill="#8a8a8a"
            opacity="0.8"
          />
          <path
            d="M68 78c0-16 28-30 92-30s92 14 92 30v10H68V78z"
            fill="#6d6d6d"
            opacity="0.45"
          />

          <rect x="150" y="94" width="20" height="72" rx="8" fill="#bdbdbd" />
          <rect x="144" y="118" width="32" height="30" rx="8" fill="#8a8a8a" opacity="0.6" />
        </g>

        <g clipPath={`url(#${clipId})`}>
          <rect x="38" y="74" width="244" height="118" rx="18" fill="url(#wood2)" />
          <rect x="52" y="90" width="216" height="86" rx="14" fill="url(#wood)" opacity="0.85" />

          <path
            d="M52 78c0-26 34-46 108-46s108 20 108 46v16H52V78z"
            fill="url(#wood2)"
          />
          <path
            d="M68 78c0-16 28-30 92-30s92 14 92 30v10H68V78z"
            fill="#ffd166"
            opacity="0.9"
          />

          <rect x="150" y="94" width="20" height="72" rx="8" fill="url(#metal)" />
          <rect x="144" y="118" width="32" height="30" rx="8" fill="#ffffff" opacity="0.55" />
        </g>
      </svg>

      
    </div>
  )
}

