import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'

// Where each dashboard mode lands after the user picks it in the post-login modal.
const MODE_ROUTES = {
  rag: '/dashboard',
  agent: '/dashboard/ai/agent',
  mcp: '/dashboard/ai/mcp',
  mcp_finetuned: '/dashboard/ai/mcp-finetuned',
}

export default function SignIn() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showModeModal, setShowModeModal] = useState(false)
  const [selectedMode, setSelectedMode] = useState('')
  const validate = () => {
    const next = {}

    if (!form.email) next.email = 'Email is required'
    if (!form.password) next.password = 'Password is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login(form)
      toast.success('Welcome back!')

      // Login successful → open mode selection. Where to land is decided
      // once the user picks a mode below (see MODE_ROUTES / handleContinue).
      setShowModeModal(true)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold text-ink-900">Sign in to your account</h2>
        <p className="mt-2 text-sm text-ink-500">
          New here?{' '}
          <Link to="/signup" className="font-medium text-brand-600 hover:underline">
            Create an account
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button type="submit" loading={loading} icon={LogIn} className="w-full">
            Sign in
          </Button>
        </form>
      </div>


      {showModeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="text-2xl font-semibold text-ink-900">
              Choose your AI mode
            </h2>

            <p className="mt-2 text-sm text-ink-500">
              How would you like to use PDF-MIND?
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              {/* Simple RAG */}
              <button
                type="button"
                onClick={() => setSelectedMode('rag')}
                className={`rounded-xl border p-5 text-left transition ${selectedMode === 'rag'
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-gray-200 hover:border-brand-400'
                  }`}
              >
                <h3 className="font-semibold text-ink-900">
                  📄 Simple PDF Q/A
                </h3>

                <p className="mt-2 text-sm text-ink-500">
                  Ask questions and get answers from your uploaded PDFs.
                </p>
              </button>

              {/* Agent */}
              <button
                type="button"
                onClick={() => setSelectedMode('agent')}
                className={`rounded-xl border p-5 text-left transition ${selectedMode === 'agent'
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-gray-200 hover:border-brand-400'
                  }`}
              >
                <h3 className="font-semibold text-ink-900">
                  🤖 AI Agent
                </h3>

                <p className="mt-2 text-sm text-ink-500">
                  AI can choose and use different tools.
                </p>
              </button>

              {/* MCP */}
              <button
                type="button"
                onClick={() => setSelectedMode('mcp')}
                className={`rounded-xl border p-5 text-left transition ${selectedMode === 'mcp'
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-gray-200 hover:border-brand-400'
                  }`}
              >
                <h3 className="font-semibold text-ink-900">
                  🔌 MCP Agent
                </h3>

                <p className="mt-2 text-sm text-ink-500">
                  Use your AI agent with MCP-based tools.
                </p>
              </button>

              {/* Fine tuned */}
              <button
                type="button"
                onClick={() => setSelectedMode('mcp_finetuned')}
                className={`rounded-xl border p-5 text-left transition ${selectedMode === 'mcp_finetuned'
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-gray-200 hover:border-brand-400'
                  }`}
              >
                <h3 className="font-semibold text-ink-900">
                  🧠 MCP + Fine-tuned
                </h3>

                <p className="mt-2 text-sm text-ink-500">
                  Use your fine-tuned model with MCP tools.
                </p>
              </button>

            </div>

            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                disabled={!selectedMode}
                onClick={() => {
                  navigate(MODE_ROUTES[selectedMode] || '/dashboard', { replace: true })
                }}
              >
                Continue
              </Button>
            </div>

          </div>
        </div>
      )}

    </>
  )
}
