import { useEffect, useRef, useState } from 'react'

// Источник истины по целям слогов (требование 1)
const TARGETS = [5, 7, 5]

// Гласные для подсчёта слогов: латиница + кириллица (требование 2)
const VOWELS = 'aeiouyàáâãäåéèêëíìîïóòôõöúùûüýÿ' + 'аеёиоуыэюя'

function countSyllables(line) {
  let n = 0
  for (const ch of line.toLowerCase()) {
    if (VOWELS.includes(ch)) n += 1
  }
  return n
}

function copyText(text) {
  // Clipboard API с фолбэком на execCommand (требование 4)
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  }
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      if (ok) resolve()
      else reject(new Error('execCommand failed'))
    } catch (err) {
      document.body.removeChild(ta)
      reject(err)
    }
  })
}

export default function App() {
  const [lines, setLines] = useState(['', '', ''])
  const [copied, setCopied] = useState(false)
  const inputsRef = [useRef(null), useRef(null), useRef(null)]

  const counts = lines.map(countSyllables)
  const perfect = TARGETS.every((t, i) => counts[i] === t)

  const setLine = (i, value) => {
    setLines((prev) => prev.map((l, j) => (j === i ? value : l)))
    setCopied(false)
  }

  const focusLine = (i) => {
    const el = inputsRef[i]?.current
    if (el) {
      el.focus()
      const end = el.value.length
      el.setSelectionRange(end, end)
    }
  }

  // Навигация с клавиатуры: Enter — следующая строка, ↑/↓ — между строками (требование 5)
  const handleKeyDown = (i) => (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      focusLine(Math.min(i + 1, 2))
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusLine(Math.min(i + 1, 2))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusLine(Math.max(i - 1, 0))
    }
  }

  const handleCopy = async () => {
    try {
      await copyText(lines.join('\n'))
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  useEffect(() => {
    focusLine(0)
  }, [])

  return (
    <div className="layout">
      <main className="haiku">
        {lines.map((line, i) => {
          const hit = counts[i] === TARGETS[i] // индикация достижения цели (требование 3)
          return (
            <div className="row" key={i}>
              <span className={'count' + (hit ? ' count--hit' : '')}>
                {counts[i] > 0 ? counts[i] : ''}
              </span>
              <input
                ref={inputsRef[i]}
                className="line"
                type="text"
                value={line}
                onChange={(e) => setLine(i, e.target.value)}
                onKeyDown={handleKeyDown(i)}
                placeholder="..."
                aria-label={`Строка ${i + 1}, цель ${TARGETS[i]} слогов`}
              />
            </div>
          )
        })}
        {perfect && (
          <button className="copy" type="button" onClick={handleCopy}>
            {copied ? 'Скопировано' : 'Скопировать'}
          </button>
        )}
      </main>
      <aside className="hint">
        <h2 className="hint__title">Как писать хайку</h2>
        <ul className="hint__list">
          <li>Классическое хайку — три строки <b>5-7-5</b> слогов.</li>
          <li><kbd>Enter</kbd> — следующая строка, <kbd>↑</kbd>/<kbd>↓</kbd> — переход между строками.</li>
          <li>Когда строки 5-7-5 — появится кнопка «Скопировать».</li>
          <li><span className="demo demo--pink">розовое</span> число — слогов не по форме, <span className="demo demo--white">белое</span> — цель достигнута.</li>
        </ul>
      </aside>
      <footer className="credit">Сайт сделан во славу и с разрешения королевы Рагнейд</footer>
    </div>
  )
}
