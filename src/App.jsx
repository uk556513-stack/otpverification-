import { useEffect, useRef, useState } from 'react'
import './App.css'

const CODE = '2105'
const LENGTH = 4

export default function App() {
  const [digits, setDigits] = useState(Array(LENGTH).fill(''))
  const [status, setStatus] = useState('idle') // idle | verifying | error | verified
  const [filling, setFilling] = useState(false)
  const inputs = useRef([])
  const timers = useRef([])

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms))
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  const activeIndex = digits.findIndex((d) => d === '')

  const verify = (code) => {
    setStatus('verifying')
    later(() => {
      if (code === CODE) {
        setStatus('verified')
      } else {
        setStatus('error')
        later(() => {
          setDigits(Array(LENGTH).fill(''))
          setStatus('idle')
          inputs.current[0]?.focus()
        }, 700)
      }
    }, 1600)
  }

  const update = (next) => {
    setDigits(next)
    if (next.every((d) => d !== '')) verify(next.join(''))
  }

  const handleChange = (i, value) => {
    if (status !== 'idle') return
    const v = value.replace(/\D/g, '')
    if (!v) return
    const next = [...digits]
    // support typing / pasting several digits at once
    v.split('').slice(0, LENGTH - i).forEach((d, k) => (next[i + k] = d))
    const focusTo = Math.min(i + v.length, LENGTH - 1)
    inputs.current[focusTo]?.focus()
    update(next)
  }

  const handleKeyDown = (i, e) => {
    if (status !== 'idle') return
    if (e.key === 'Backspace') {
      e.preventDefault()
      const next = [...digits]
      if (next[i]) {
        next[i] = ''
      } else if (i > 0) {
        next[i - 1] = ''
        inputs.current[i - 1]?.focus()
      }
      setDigits(next)
    } else if (e.key === 'ArrowLeft' && i > 0) {
      inputs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowRight' && i < LENGTH - 1) {
      inputs.current[i + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH)
    if (text) handleChange(0, text)
  }

  const fillCode = () => {
    if (filling || status !== 'idle') return
    setFilling(true)
    const empty = Array(LENGTH).fill('')
    setDigits(empty)
    CODE.split('').forEach((d, i) => {
      later(() => {
        setDigits((prev) => {
          const next = [...prev]
          next[i] = d
          return next
        })
        inputs.current[Math.min(i + 1, LENGTH - 1)]?.focus()
        if (i === LENGTH - 1) {
          setFilling(false)
          verify(CODE)
        }
      }, 280 * (i + 1))
    })
  }

  const reset = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setDigits(Array(LENGTH).fill(''))
    setStatus('idle')
    setFilling(false)
    later(() => inputs.current[0]?.focus(), 50)
  }

  const merged = status === 'verifying' || status === 'verified'
  const verified = status === 'verified'

  return (
    <main className="page">
      <h1 className="title">OTP Verification</h1>

      <div className="card-wrap">
        <section className={`otp-card ${verified ? 'otp-card-blurred' : ''}`} aria-hidden={verified}>
          <div className="card-header-inner">
            <span className="brand">NEXORA</span>
            <h2>Verify Number</h2>
            <p>
              Enter the 4-digit code sent to <strong>+91 93425 *** 75</strong>
            </p>
          </div>

          <div
            className={`otp-row ${merged ? 'merged' : ''} ${status === 'error' ? 'error' : ''}`}
            onPaste={handlePaste}
          >
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                className={`otp-box ${d ? 'filled' : ''} ${
                  status === 'idle' && (i === activeIndex || (activeIndex === -1 && i === LENGTH - 1)) ? 'active' : ''
                }`}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={LENGTH}
                value={d}
                aria-label={`Digit ${i + 1}`}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={(e) => e.target.select()}
                disabled={status !== 'idle' || filling}
              />
            ))}
            <span className="scan-line" />
          </div>

          <p className="hint">
            {status === 'verifying' && 'Verifying…'}
            {status === 'error' && 'Incorrect code. Try again.'}
          </p>

          <div className="message">
            <div>
              <span className="message-label">MESSAGE</span>
              <p>
                NEXORA — <strong>{CODE}</strong> is your verification code
              </p>
            </div>
            <button className="fill-btn" onClick={fillCode} disabled={filling || status !== 'idle'}>
              Fill Code
            </button>
          </div>
        </section>

        {verified && (
          <section className="success" role="status">
            <div className="check">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </div>
            <h2>Number Verified</h2>
            <p>You are logged in on this device.</p>
            <button className="continue-btn" onClick={reset}>
              Continue
            </button>
          </section>
        )}
      </div>
    </main>
  )
}
