import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'

export default function SignUp() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const next = {}
    if (!form.name) next.name = 'Full name is required'
    if (!form.email) next.email = 'Email is required'
    if (!form.password || form.password.length < 6) next.password = 'At least 6 characters'
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const result = await register({ name: form.name, email: form.email, password: form.password })
      if (result.sessionActive) {
        toast.success('Account created successfully')
        navigate('/dashboard', { replace: true })
      } else {
        toast.success('Account created — please sign in')
        navigate('/signin', { replace: true })
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not create your account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-ink-900">Create your account</h2>
      <p className="mt-2 text-sm text-ink-500">
        Already have an account?{' '}
        <Link to="/signin" className="font-medium text-brand-600 hover:underline">
          Sign in
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <Input
          label="Full name"
          placeholder="Jane Doe"
          value={form.name}
          error={errors.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          value={form.confirmPassword}
          error={errors.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />

        <Button type="submit" loading={loading} icon={UserPlus} className="w-full">
          Create account
        </Button>
      </form>
    </div>
  )
}
