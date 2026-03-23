'use client'

import { useState } from 'react'
import { loginAdminAction } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
    <div className="max-w-md w-full mx-auto">
      <div className="pcc-card p-8 md:p-10 bg-white shadow-lg border-border">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/pcclogo.png" alt="PCC Logo" width={72} height={72} className="rounded-full" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">PCC Complaint Administration</h1>
          <p className="text-xs text-muted-foreground mt-2 font-urdu">انتظامی پینل میں لاگ ان کریں</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 border border-red-200 bg-red-50 text-red-800 text-sm font-medium rounded-md flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-foreground">Email Address</label>
            <input required type="email" id="email" name="email" className="pcc-input" placeholder="admin@pcc.punjab.gov.pk" />
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-foreground">Password</label>
            <input required type="password" id="password" name="password" className="pcc-input" placeholder="••••••••" />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="pcc-btn-primary w-full h-11 text-sm font-bold"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Authenticating...
              </span>
            ) : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
