import { getAdminQuery } from '@/app/actions/admin'
import Link from 'next/link'
import { QueryReplyForm } from '@/components/QueryReplyForm'

export default async function QueryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const result = await getAdminQuery(resolvedParams.id)

  if (result.error) {
    return (
      <div className="p-8">
        <Link href="/admin/dashboard" className="text-sm font-medium hover:underline mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <div className="p-4 bg-red-50 text-red-800 border border-red-200">
          Error: {result.error}. This query might not exist or you lack permissions to view it.
        </div>
      </div>
    )
  }

  const query = result.query

  return (
    <div className="max-w-7xl mx-auto">
      <Link href="/admin/dashboard" className="text-zinc-500 text-sm font-medium hover:text-zinc-900 mb-6 inline-block transition-colors">
        &larr; Back to Dashboard
      </Link>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            Query Details
            <span className={`text-xs px-2 py-1 uppercase tracking-widest font-bold ${
              query.status === 'resolved' ? 'bg-green-100 text-green-800' :
              query.status === 'replied' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {query.status}
            </span>
          </h1>
          <p className="text-zinc-500 font-mono text-sm mt-1">ID: {query.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="sleek-card p-5 bg-white space-y-4 col-span-2">
          <h3 className="font-bold border-b border-zinc-100 pb-2 text-zinc-900">Issuer Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-500">Name</p>
              <p className="font-medium">{query.user_name}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Phone Number</p>
              <p className="font-mono">{query.phone_number}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Charity Name</p>
              <p className="font-medium">{query.charity_name}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Registration No.</p>
              <p className="font-medium">{query.charity_reg_no || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="sleek-card p-5 bg-zinc-50 space-y-4">
          <h3 className="font-bold border-b border-zinc-200 pb-2 text-zinc-900">Meta</h3>
          <div>
            <p className="text-xs text-zinc-500">Category</p>
            <p className="font-medium capitalize">{query.query_category}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Submitted On</p>
            <p className="font-medium">{new Date(query.created_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="sleek-card p-6 bg-white col-span-1 md:col-span-3">
          <h3 className="font-bold text-zinc-900 mb-2">Message</h3>
          <p className="text-zinc-700 whitespace-pre-wrap leading-relaxed">{query.message}</p>
        </div>
      </div>

      <QueryReplyForm 
        queryId={query.id} 
        currentStatus={query.status} 
        currentReply={query.admin_reply || ''} 
      />
    </div>
  )
}
