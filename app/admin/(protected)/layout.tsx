import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
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

  const role = user.app_metadata?.role || ''
  const roleLabel = role === 'superadmin' ? 'Super Admin' : role === 'misc' ? 'General' : role.charAt(0).toUpperCase() + role.slice(1)

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-pcc-950 text-pcc-300 md:min-h-screen flex flex-col shrink-0">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-pcc-900/50">
          <div className="flex items-center gap-3">
            <Image src="/pcclogo.png" alt="PCC" width={36} height={36} className="rounded-full bg-white p-0.5" />
            <div>
              <h2 className="text-white font-bold text-sm tracking-tight">PCC Administration</h2>
              <p className="text-xs text-pcc-400 font-urdu mt-0.5">پنجاب چیریٹیز کمیشن</p>
            </div>
          </div>
        </div>
        
        {/* User Info */}
        <div className="px-5 py-3 border-b border-pcc-900/30">
          <p className="text-xs text-pcc-500 mb-0.5">Logged in as</p>
          <p className="text-sm text-pcc-200 font-medium truncate">{user.email}</p>
          <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full bg-pcc-800 text-pcc-300 font-semibold capitalize">
            {roleLabel}
          </span>
        </div>

        <AdminSidebarNav role={role} />

        <div className="p-4 mt-auto border-t border-pcc-900/30">
          <form action={logoutAdminAction}>
            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-pcc-400 hover:text-white hover:bg-pcc-900 rounded-md transition-colors duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              Sign Out
            </button>
          </form>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-border h-14 flex items-center px-6 md:px-8 sticky top-0 z-10">
          <h1 className="font-semibold text-foreground text-sm">Complaint Management System</h1>
        </header>
        <div className="p-5 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
