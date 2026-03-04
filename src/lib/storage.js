import { generateUnique3DigitCodes } from './passwords.js'

const STORAGE_KEY = 'kid-treasure:v1'

const DEFAULT_CHILD_COUNT = 3
const MIN_CHILD_COUNT = 1
const MAX_CHILD_COUNT = 20

export const UNLOCK_MODES = {
  card: 'card',
  hint: 'hint',
}

export const WRONG_HINT_TYPES = {
  text: 'text',
  image: 'image',
}

export function clampChildCount(value) {
  const n = Math.floor(Number(value))

  if (!Number.isFinite(n)) {
    return DEFAULT_CHILD_COUNT
  }

  return Math.min(MAX_CHILD_COUNT, Math.max(MIN_CHILD_COUNT, n))
}

export function createFreshState(childCount = DEFAULT_CHILD_COUNT) {
  const safeCount = clampChildCount(childCount)
  const codes = generateUnique3DigitCodes(safeCount)

  return {
    version: 1,
    childCount: safeCount,
    codes,
    unlocked: Array.from({ length: safeCount }, () => false),
    unlockMode: UNLOCK_MODES.card,
    finalHintText: '最後的寶藏提示寫在這裡！',
    wrongHintType: WRONG_HINT_TYPES.text,
    wrongHintText: '再試一次～仔細想想看！',
    wrongHintImageDataUrl: null,
  }
}

function hasDuplicates(values) {
  return new Set(values).size !== values.length
}

function sanitizeState(raw) {
  if (!raw || typeof raw !== 'object') {
    return createFreshState()
  }

  const childCount = clampChildCount(raw.childCount)
  let codes = Array.isArray(raw.codes) ? raw.codes.slice(0, childCount) : []
  let codesRegenerated = false

  if (
    codes.length !== childCount ||
    codes.some((c) => typeof c !== 'string' || !/^[0-9]{3}$/.test(c)) ||
    hasDuplicates(codes)
  ) {
    codes = generateUnique3DigitCodes(childCount)
    codesRegenerated = true
  }

  const unlockedRaw = Array.isArray(raw.unlocked) ? raw.unlocked : []
  const unlocked = codesRegenerated
    ? Array.from({ length: childCount }, () => false)
    : Array.from({ length: childCount }, (_, index) => {
        return Boolean(unlockedRaw[index])
      })

  const unlockMode =
    raw.unlockMode === UNLOCK_MODES.hint ? UNLOCK_MODES.hint : UNLOCK_MODES.card

  const finalHintText = typeof raw.finalHintText === 'string' ? raw.finalHintText : ''

  const wrongHintType =
    raw.wrongHintType === WRONG_HINT_TYPES.image
      ? WRONG_HINT_TYPES.image
      : WRONG_HINT_TYPES.text

  const wrongHintText = typeof raw.wrongHintText === 'string' ? raw.wrongHintText : ''

  const wrongHintImageDataUrl =
    typeof raw.wrongHintImageDataUrl === 'string' ? raw.wrongHintImageDataUrl : null

  return {
    version: 1,
    childCount,
    codes,
    unlocked,
    unlockMode,
    finalHintText,
    wrongHintType,
    wrongHintText,
    wrongHintImageDataUrl,
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const fresh = createFreshState()
      saveState(fresh)
      return fresh
    }

    const parsed = JSON.parse(raw)
    const sanitized = sanitizeState(parsed)
    saveState(sanitized)
    return sanitized
  } catch {
    const fresh = createFreshState()
    saveState(fresh)
    return fresh
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
