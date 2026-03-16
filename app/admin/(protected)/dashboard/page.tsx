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
              : `Viewing queries for category: ${(role || '').toUpperCase()}`
            }
          </p>
        </div>
      </div>

      <div className="sleek-card bg-white overflow-hidden border-zinc-200 shadow-sm mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-100 border-b border-zinc-200 text-zinc-600 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted On</th>
                {role === 'superadmin' && <th className="px-6 py-4">Category</th>}
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Charity / Organization</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {queries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-zinc-300 text-4xl mb-2">Inbox Empty</span>
                      <p>You have no queries requiring your attention at this time.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                queries.map((q: any) => (
                  <tr key={q.id} className="hover:bg-zinc-50 transition-colors group cursor-default">
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
                        q.status === 'resolved' ? 'border-green-200 text-green-700 bg-green-50' :
                        q.status === 'replied' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-amber-200 text-amber-700 bg-amber-50'
                      }`}>
                        {q.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-zinc-600 font-medium">
                      {new Date(q.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    {role === 'superadmin' && (
                      <td className="px-6 py-5 capitalize font-medium text-zinc-800">
                        {q.query_category}
                      </td>
                    )}
                    <td className="px-6 py-5 font-semibold text-zinc-900">{q.user_name}</td>
                    <td className="px-6 py-5 font-mono text-zinc-600 text-xs">{q.phone_number}</td>
                    <td className="px-6 py-5">
                      <div className="max-w-[250px] truncate text-zinc-700" title={q.charity_name}>
                        {q.charity_name}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link 
                        href={`/admin/query/${q.id}`} 
                        className="inline-flex items-center justify-center px-4 py-2 border border-zinc-200 text-sm font-medium text-zinc-900 bg-white hover:bg-zinc-100 transition-colors"
                      >
                        View Details
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
