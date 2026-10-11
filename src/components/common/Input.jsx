import React, { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const Input = forwardRef(function Input(
  { label, error, type = 'text', className = '', id, ...rest },
  ref
) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={isPassword && show ? 'text' : type}
          className={`focus-ring w-full rounded-lg border px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 ${
            error ? 'border-rose-400' : 'border-ink-200'
          } ${className}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  )
})

export default Input
