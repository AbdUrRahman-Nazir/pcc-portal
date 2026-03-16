import { getAdminQueries } from '@/app/actions/admin'
import Link from 'next/link'

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
              : `Viewing queries for category: ${role.toUpperCase()}`
            }
          </p>
        </div>
      </div>

      <div className="sleek-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted On</th>
                {role === 'superadmin' && <th className="px-6 py-4">Category</th>}
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Charity</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {queries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">
                    No queries found.
                  </td>
                </tr>
              ) : (
                queries.map((q: any) => (
                  <tr key={q.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-bold ${
                        q.status === 'resolved' ? 'text-green-700 bg-green-100' :
                        q.status === 'replied' ? 'text-blue-700 bg-blue-100' : 'text-yellow-700 bg-yellow-100'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(q.created_at).toLocaleDateString()}</td>
                    {role === 'superadmin' && (
                      <td className="px-6 py-4 capitalize">{q.query_category}</td>
                    )}
                    <td className="px-6 py-4">{q.user_name}</td>
                    <td className="px-6 py-4 font-mono">{q.phone_number}</td>
                    <td className="px-6 py-4 max-w-[200px] truncate" title={q.charity_name}>{q.charity_name}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/query/${q.id}`} className="text-zinc-900 font-medium hover:underline">
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
