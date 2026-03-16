import { getAdminQueries } from '@/app/actions/admin'
import { AdminDashboardTable } from '@/components/AdminDashboardTable'

export default async function DashboardPage() {
  const result = await getAdminQueries()

  if (result.error) {
    return <div className="p-4 bg-red-50 text-red-800">{result.error}</div>
  }

  const queries = result.queries || []
  const role = result.role

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support Queries</h1>
          <p className="text-zinc-500 text-sm">
            {role === 'superadmin' 
              ? 'Viewing all categories as Super Admin'
              : `Viewing queries for category: ${(role || '').toUpperCase()}`
            }
          </p>
        </div>
      </div>

      <AdminDashboardTable initialQueries={queries} role={role || ''} />
    </div>
  )
}
