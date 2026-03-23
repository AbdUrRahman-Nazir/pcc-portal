import { getAdminQuery } from '@/app/actions/admin'
import Link from 'next/link'
import { QueryReplyForm } from '@/components/QueryReplyForm'

function categoryDisplayName(cat: string) {
  return cat === 'misc' ? 'General' : cat
}

export default async function QueryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const result = await getAdminQuery(resolvedParams.id)

  if (result.error) {
    return (
      <div>
        <Link href="/admin/dashboard" className="text-sm font-medium text-pcc-600 hover:text-pcc-800 mb-4 inline-flex items-center gap-1 transition-colors duration-150">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back to Complaints
        </Link>
        <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg mt-2">
          Error: {result.error}. This complaint might not exist or you lack permissions to view it.
        </div>
      </div>
    )
  }

  const query = result.query

  return (
    <div className="max-w-7xl mx-auto">
      <Link href="/admin/dashboard" className="text-muted-foreground text-sm font-medium hover:text-foreground mb-6 inline-flex items-center gap-1 transition-colors duration-150">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        Back to Complaints
      </Link>
      
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3 text-foreground">
            Complaint Details
            <span className={`text-xs px-2.5 py-1 uppercase tracking-widest font-bold rounded-full border ${
              query.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              query.status === 'replied' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {query.status}
            </span>
          </h1>
          <p className="text-muted-foreground font-mono text-xs mt-1.5">ID: {query.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Issuer Information */}
        <div className="pcc-card p-5 bg-white space-y-4 col-span-2 shadow-sm">
          <h3 className="font-bold border-b border-border pb-2 text-foreground flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pcc-600"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Complainant Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Name</p>
              <p className="font-medium text-foreground">{query.user_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Phone Number</p>
              <p className="font-mono text-foreground">{query.phone_number}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Charity Name</p>
              <p className="font-medium text-foreground">{query.charity_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Registration No.</p>
              <p className="font-medium text-foreground">{query.charity_reg_no || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Submission Info */}
        <div className="pcc-card p-5 bg-pcc-50/30 space-y-4 shadow-sm">
          <h3 className="font-bold border-b border-pcc-100 pb-2 text-foreground flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pcc-600"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Submission Info
          </h3>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Category</p>
            <p className="font-medium capitalize text-foreground">{categoryDisplayName(query.query_category)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Submitted On</p>
            <p className="font-medium text-foreground">{new Date(query.created_at).toLocaleString()}</p>
          </div>
        </div>

        {/* Complaint Message */}
        <div className="pcc-card p-6 bg-white col-span-1 md:col-span-3 shadow-sm">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pcc-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>
            Complaint Description
          </h3>
          <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">{query.message}</p>
        </div>

        {/* Image Attachments */}
        {query.attachment_urls && query.attachment_urls.length > 0 && (
          <div className="pcc-card p-6 bg-white col-span-1 md:col-span-3 shadow-sm">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pcc-600"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              Image Attachments ({query.attachment_urls.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {query.attachment_urls.map((url: string, i: number) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-border bg-muted aspect-video relative group">
                  <img src={url} alt={`Attachment ${i + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-150 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-white/90 text-foreground px-3 py-1 rounded-md text-xs font-semibold">
                      View Full Size
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Voice Recording */}
        {query.voice_url && (
          <div className="pcc-card p-6 bg-white col-span-1 md:col-span-3 shadow-sm">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pcc-600"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              Voice Recording
            </h3>
            <audio src={query.voice_url} controls className="w-full max-w-md" />
          </div>
        )}
      </div>

      <QueryReplyForm 
        queryId={query.id} 
        currentStatus={query.status} 
        currentReply={query.admin_reply || ''} 
      />
    </div>
  )
}
