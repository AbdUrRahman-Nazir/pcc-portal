import { getUsersAction } from '@/app/actions/users'
import { AdminUsersTable } from '@/components/AdminUsersTable'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.role !== 'superadmin') {
    redirect('/admin/dashboard')
  }

  const result = await getUsersAction()

  if (result.error) {
    return <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">{result.error}</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Manage Admins</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Add, configure roles, or remove administrator access.</p>
        </div>
      </div>

      <AdminUsersTable users={result.users || []} currentUserId={user.id} />
    </div>
  )
}
