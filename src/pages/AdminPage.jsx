import { useMemo, useState } from 'react'
import {
  clampChildCount,
  createFreshState,
  loadState,
  saveState,
  UNLOCK_MODES,
} from '../lib/storage.js'

export default function AdminPage() {
  const [state, setState] = useState(() => loadState())
  const [childCountInput, setChildCountInput] = useState(state.childCount)
  const [unlockModeInput, setUnlockModeInput] = useState(state.unlockMode)
  const [finalHintTextInput, setFinalHintTextInput] = useState(state.finalHintText)

  const unlockedCount = useMemo(() => state.unlocked.filter(Boolean).length, [state.unlocked])
  const hasUnlockedProgress = unlockedCount > 0

  const childCount = useMemo(() => clampChildCount(childCountInput), [childCountInput])

  function update(next) {
    saveState(next)
    setState(next)
  }

  function clearProgress() {
    const next = {
      ...state,
      unlocked: Array.from({ length: state.childCount }, () => false),
    }
    update(next)
  }

  const childCountChanged = childCount !== state.childCount
  const unlockModeChanged = unlockModeInput !== state.unlockMode
  const finalHintTextChanged =
    unlockModeInput === UNLOCK_MODES.hint && finalHintTextInput !== state.finalHintText
  const hasPendingChanges = childCountChanged || unlockModeChanged || finalHintTextChanged

  function applyChanges() {
    let next
    if (childCountChanged) {
      const fresh = createFreshState(childCount)
      next = {
        ...fresh,
        unlockMode: unlockModeInput,
        finalHintText: finalHintTextInput,
      }
    } else {
      next = {
        ...state,
        unlockMode: unlockModeInput,
        finalHintText: finalHintTextInput,
      }
    }

    update(next)
    setChildCountInput(next.childCount)
    setUnlockModeInput(next.unlockMode)
    setFinalHintTextInput(next.finalHintText)
  }

  return (
    <div className="grid2">
      <div className="adminTopRow">
        <div className="adminTopRowInner">
          <button
            type="button"
            className="btn btnDanger"
            onClick={clearProgress}
            disabled={!hasUnlockedProgress}
            aria-disabled={!hasUnlockedProgress}
          >
            清除解鎖進度
          </button>
        </div>
      </div>

      <section className="panel">
        <h2 className="panelTitle">管理員設定</h2>

        <div className="row">
          <div style={{ flex: '1 1 180px' }}>
            <div className="fieldLabel">兒童人數（會重新產生全部密碼）</div>
            <input
              className="input"
              inputMode="numeric"
              type="number"
              min={1}
              max={20}
              value={childCountInput}
              onChange={(e) => setChildCountInput(e.target.value)}
            />
          </div>
        </div>

        <div style={{ height: 12 }} />

        <div className="fieldLabel">全部解鎖成功後顯示</div>
        <div className="row">
          <label className="pill">
            <input
              type="radio"
              name="unlockMode"
              checked={unlockModeInput === UNLOCK_MODES.card}
              onChange={() => setUnlockModeInput(UNLOCK_MODES.card)}
            />
            <span style={{ width: 8 }} />
            寶藏兌換卡
          </label>
          <label className="pill">
            <input
              type="radio"
              name="unlockMode"
              checked={unlockModeInput === UNLOCK_MODES.hint}
              onChange={() => setUnlockModeInput(UNLOCK_MODES.hint)}
            />
            <span style={{ width: 8 }} />
            最終寶藏提示
          </label>
        </div>

        {unlockModeInput === UNLOCK_MODES.hint ? (
          <div style={{ marginTop: 10 }}>
            <div className="fieldLabel">最終寶藏提示（文字）</div>
            <textarea
              className="textarea"
              value={finalHintTextInput}
              onChange={(e) => setFinalHintTextInput(e.target.value)}
              placeholder="例如：去書櫃第三層找找看！"
            />
          </div>
        ) : null}

        <div style={{ height: 12 }} />

        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btnPrimary"
            onClick={applyChanges}
            disabled={!hasPendingChanges}
          >
            套用
          </button>
        </div>
      </section>

      <section className="panel">
        <h2 className="panelTitle">目前密碼（管理員用）</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {state.codes.map((code, index) => (
            <div key={index} className="row" style={{ justifyContent: 'space-between' }}>
              <div className="pill">小朋友 {index + 1}</div>
              <div className="pill" style={{ fontSize: 20, letterSpacing: 3 }}>
                {code}
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 12 }} />

        <div className="fieldLabel">提示</div>
        <div style={{ fontSize: 14, opacity: 0.8 }}>
          更改設定後按「套用」才會生效；若調整人數會重設密碼與進度。
        </div>
      </section>
    </div>
  )
}
