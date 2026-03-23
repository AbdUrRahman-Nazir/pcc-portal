import { getAdminQueries } from '@/app/actions/admin'
import { AdminDashboardTable } from '@/components/AdminDashboardTable'

export default async function DashboardPage() {
  const result = await getAdminQueries()

  if (result.error) {
    return <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">{result.error}</div>
  }

  const queries = result.queries || []
  const role = result.role

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Complaint Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {role === 'superadmin' 
              ? 'Viewing all departments as Super Admin'
              : `Viewing complaints for: ${role === 'misc' ? 'General' : (role || '').charAt(0).toUpperCase() + (role || '').slice(1)}`
            }
          </p>
        </div>
      </div>

      <AdminDashboardTable initialQueries={queries} role={role || ''} />
    </div>
  )
}
