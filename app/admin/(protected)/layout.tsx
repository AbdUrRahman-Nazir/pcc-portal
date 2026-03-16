import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logoutAdminAction } from '@/app/actions/auth'
import { AdminSidebarNav } from '@/components/AdminSidebarNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-zinc-900 text-zinc-300 md:min-h-screen flex flex-col">
        <div className="p-6">
          <h2 className="text-white font-bold text-lg tracking-tight">PCC Admin</h2>
          <p className="text-xs text-zinc-500 mt-1">{user.email}</p>
        </div>
        
        <AdminSidebarNav role={user.app_metadata?.role || ''} />

        <div className="p-4 mt-auto">
          <form action={logoutAdminAction}>
            <button className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-sm">
              Sign Out
            </button>
          </form>
        </div>
      </aside>
      
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-zinc-200 h-16 flex items-center px-8 shadow-sm">
          <h1 className="font-semibold text-zinc-800">Control Panel</h1>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
