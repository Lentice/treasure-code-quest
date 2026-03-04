import { useMemo, useRef, useState } from 'react'
import Chest from '../components/Chest.jsx'
import FlipCard from '../components/FlipCard.jsx'
import HintBox from '../components/HintBox.jsx'
import RewardCard from '../components/RewardCard.jsx'
import { fireConfetti } from '../lib/confetti.js'
import { loadState, saveState, UNLOCK_MODES } from '../lib/storage.js'

export default function PlayPage() {
  const [state, setState] = useState(() => loadState())
  const [digits, setDigits] = useState('')
  const [showWrongHint, setShowWrongHint] = useState(false)
  const [usedMessage, setUsedMessage] = useState('')
  const [isRevealed, setIsRevealed] = useState(false)
  const inputRef = useRef(null)

  const unlockedChestSrc = `${import.meta.env.BASE_URL}unlocked-chest.png`

  const unlockedCount = useMemo(
    () => state.unlocked.filter(Boolean).length,
    [state.unlocked],
  )

  const progress = state.childCount > 0 ? unlockedCount / state.childCount : 0
  const allUnlocked = unlockedCount === state.childCount && state.childCount > 0
  const progressPercent = state.childCount > 0 ? Math.round(progress * 100) : 0

  function update(next) {
    saveState(next)
    setState(next)
  }

  function clearInput() {
    setDigits('')
    setShowWrongHint(false)
    setUsedMessage('')
    inputRef.current?.focus()
  }

  function submit(code) {
    if (allUnlocked) return
    if (code.length !== 3) return

    const matchIndex = state.codes.findIndex(
      (c, index) => !state.unlocked[index] && c === code,
    )

    if (matchIndex >= 0) {
      const unlocked = state.unlocked.slice()
      unlocked[matchIndex] = true

      const willAllUnlocked = unlocked.every(Boolean) && unlocked.length > 0

      const next = { ...state, unlocked }
      update(next)

      fireConfetti({ kind: willAllUnlocked ? 'fireworks' : 'confetti' })
      clearInput()
      return
    }

    const usedIndex = state.codes.findIndex(
      (c, index) => state.unlocked[index] && c === code,
    )

    if (usedIndex >= 0) {
      setShowWrongHint(false)
      setUsedMessage('這組密碼已經解鎖過囉！')
      setDigits('')
      inputRef.current?.focus()
      return
    }

    setUsedMessage('')
    setShowWrongHint(true)
    setDigits('')
    inputRef.current?.focus()
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {!allUnlocked ? (
        <>
          <section className="panel">
            <form
              className="row"
              onSubmit={(e) => {
                e.preventDefault()
                submit(digits)
              }}
              style={{ alignItems: 'stretch' }}
            >
              <input
                ref={inputRef}
                className="input"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                placeholder="輸入 3 位數密碼"
                value={digits}
                maxLength={3}
                disabled={allUnlocked}
                onChange={(e) => {
                  if (allUnlocked) return

                  const next = (e.target.value || '').replace(/\D/g, '').slice(0, 3)
                  setDigits(next)
                  setShowWrongHint(false)
                  setUsedMessage('')

                  if (next.length === 3 && next !== digits) {
                    submit(next)
                  }
                }}
                aria-label="輸入 3 位數密碼"
                style={{ flex: '1 1 200px', textAlign: 'center', letterSpacing: 6 }}
              />

              <button
                type="submit"
                className="btn btnPrimary"
                disabled={allUnlocked || digits.length !== 3}
                style={{ flex: '0 0 auto', minWidth: 110 }}
              >
                解鎖
              </button>
            </form>

            <div style={{ height: 12 }} />

            {usedMessage && !allUnlocked ? (
              <div className="pill" role="status" style={{ width: '100%', justifyContent: 'center' }}>
                {usedMessage}
              </div>
            ) : null}

            {showWrongHint && !allUnlocked ? (
              <HintBox title="密碼不對喔！" text="再試一次～仔細想想看！" />
            ) : null}
          </section>

          <div className="row" style={{ justifyContent: 'center' }}>
            <div className="pill">
              進度 {unlockedCount}/{state.childCount} ({progressPercent}%)
            </div>
          </div>
        </>
      ) : null}

      {allUnlocked ? (
        <FlipCard
          className="rewardCard"
          isFlipped={isRevealed}
          disabled={isRevealed}
          ariaLabel="點一下翻面揭曉寶藏"
          onFlip={() => setIsRevealed(true)}
          front={
            <div className="rewardInner" aria-label="寶箱">
              <div className="rewardTitle">
                <div>寶箱已解鎖！</div>
                <div style={{ fontSize: '14px', marginTop: 4 }}>點一下打開寶藏！</div>
              </div>
              <div className="rewardArtWrap" style={{ padding: 8 }}>
                <img className="rewardArt rewardArtContain" src={unlockedChestSrc} alt="寶箱" />
              </div>
            </div>
          }
          back={
            state.unlockMode === UNLOCK_MODES.card ? (
              <RewardCard embedded />
            ) : (
              <div className="rewardInner" aria-label="最終寶藏提示">
                <div className="rewardTitle">最終寶藏提示</div>
                <div
                  className="rewardArtWrap"
                  style={{ padding: 12, alignContent: 'start', fontSize: 18, lineHeight: 1.5 }}
                >
                  {state.finalHintText || '（尚未設定最終提示）'}
                </div>
              </div>
            )
          }
        />
      ) : (
        <Chest progress={progress} glow={false} />
      )}
    </div>
  )
}

