'use client'

import { useState } from 'react'
import { loginAdminAction } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'

export function AdminLoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await loginAdminAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 sleek-card bg-white shadow-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black tracking-tight mb-2">Admin Panel</h1>
        <p className="text-sm text-zinc-500">Sign in to manage PCC queries</p>
      </div>
      
      <form onSubmit={handleLogin} className="space-y-6">
        {error && (
          <div className="p-3 border border-red-200 bg-red-50 text-red-800 text-sm font-medium">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold">Email Address</label>
          <input required type="email" id="email" name="email" className="sleek-input" placeholder="admin@charitycommission.punjab.gov.pk" />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-semibold">Password</label>
          <input required type="password" id="password" name="password" className="sleek-input" placeholder="••••••••" />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="sleek-button-primary w-full h-11 text-base font-bold"
        >
          {isLoading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
