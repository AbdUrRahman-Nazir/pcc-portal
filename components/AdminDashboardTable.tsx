'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { deleteAdminQueriesAction } from '@/app/actions/admin'

interface AdminDashboardTableProps {
  initialQueries: any[]
  role: string
}

function categoryDisplayName(cat: string) {
  return cat === 'misc' ? 'General' : cat
}

export function AdminDashboardTable({ initialQueries, role }: AdminDashboardTableProps) {
  const [queries, setQueries] = useState(initialQueries)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ mode: 'single' | 'bulk' | 'none', id?: string }>({ mode: 'none' })
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Stats
  const stats = useMemo(() => ({
    total: queries.length,
    pending: queries.filter(q => q.status === 'pending').length,
    replied: queries.filter(q => q.status === 'replied').length,
    resolved: queries.filter(q => q.status === 'resolved').length,
  }), [queries])

  const filteredQueries = useMemo(() => {
    let filtered = queries
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(q => q.query_category === categoryFilter)
    }
    if (searchQuery.trim()) {
      const search = searchQuery.toLowerCase()
      filtered = filtered.filter(q => 
        q.charity_name?.toLowerCase().includes(search) ||
        q.user_name?.toLowerCase().includes(search) ||
        q.phone_number?.includes(search)
      )
    }
    return filtered
  }, [queries, categoryFilter, searchQuery])

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredQueries.length && filteredQueries.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredQueries.map(q => q.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIds(newSet)
  }

  const triggerDeleteSelected = () => {
    if (selectedIds.size === 0) return
    setDeleteModal({ mode: 'bulk' })
    setError(null)
  }

  const triggerDeleteSingle = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDeleteModal({ mode: 'single', id })
    setError(null)
  }

  const executeDelete = async () => {
    setIsDeleting(true)
    setError(null)
    
    let idsToDelete: string[] = []
    if (deleteModal.mode === 'bulk') {
      idsToDelete = Array.from(selectedIds)
    } else if (deleteModal.mode === 'single' && deleteModal.id) {
      idsToDelete = [deleteModal.id]
    }

    if (idsToDelete.length === 0) {
      setIsDeleting(false)
      return
    }

    const result = await deleteAdminQueriesAction(idsToDelete)
    
    if (result.error) {
      setError(result.error)
    } else {
      setQueries(queries.filter(q => !idsToDelete.includes(q.id)))
      if (deleteModal.mode === 'bulk') {
        setSelectedIds(new Set())
      } else if (deleteModal.mode === 'single' && deleteModal.id) {
        const newSet = new Set(selectedIds)
        newSet.delete(deleteModal.id)
        setSelectedIds(newSet)
      }
      setDeleteModal({ mode: 'none' })
    }
    setIsDeleting(false)
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="pcc-stat-card border-l-4 border-l-pcc-600">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="pcc-stat-card border-l-4 border-l-amber-500">
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
        </div>
        <div className="pcc-stat-card border-l-4 border-l-blue-500">
          <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Replied</p>
          <p className="text-2xl font-bold text-blue-700">{stats.replied}</p>
        </div>
        <div className="pcc-stat-card border-l-4 border-l-emerald-500">
          <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Resolved</p>
          <p className="text-2xl font-bold text-emerald-700">{stats.resolved}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="text"
              placeholder="Search by name, charity, phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pcc-input pl-9 h-9 text-sm"
            />
          </div>

          {/* Category Filter (Super Admin) */}
          {role === 'superadmin' && (
            <select 
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setSelectedIds(new Set())
              }}
              className="pcc-input h-9 text-sm w-full sm:w-auto sm:min-w-[160px]"
            >
              <option value="all">All Departments</option>
              <option value="registration">Registration</option>
              <option value="renewal">Renewal</option>
              <option value="observation">Observation</option>
              <option value="misc">General</option>
            </select>
          )}
        </div>

        {/* Delete Button (Super Admin) */}
        {role === 'superadmin' && selectedIds.size > 0 && (
          <button
            onClick={triggerDeleteSelected}
            disabled={isDeleting}
            className="pcc-btn h-9 px-4 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50 text-sm"
          >
            Delete Selected ({selectedIds.size})
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="pcc-card bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-pcc-50/50 border-b border-border text-muted-foreground font-semibold uppercase text-xs tracking-wider">
              <tr>
                {role === 'superadmin' && (
                  <th className="px-5 py-3.5 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-border text-pcc-600 focus:ring-pcc-500 w-4 h-4 cursor-pointer"
                      checked={filteredQueries.length > 0 && selectedIds.size === filteredQueries.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                )}
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Submitted</th>
                {role === 'superadmin' && <th className="px-5 py-3.5">Category</th>}
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Charity</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredQueries.length === 0 ? (
                <tr>
                  <td colSpan={role === 'superadmin' ? 8 : 6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-30"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <p className="font-medium">No Complaints Found</p>
                      <p className="text-xs mt-1">No complaints match the current filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQueries.map((q: any) => (
                  <tr key={q.id} className="hover:bg-accent/30 transition-colors duration-100 cursor-default">
                    {role === 'superadmin' && (
                      <td className="px-5 py-4">
                        <input 
                          type="checkbox"
                          className="rounded border-border text-pcc-600 focus:ring-pcc-500 w-4 h-4 cursor-pointer"
                          checked={selectedIds.has(q.id)}
                          onChange={() => toggleSelect(q.id)}
                        />
                      </td>
                    )}
                    <td className="px-5 py-4">
                      <span className={`pcc-badge-${q.status}`}>
                        {q.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-muted-foreground text-xs font-medium">
                      {new Date(q.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    {role === 'superadmin' && (
                      <td className="px-5 py-4 capitalize font-medium text-foreground text-xs">
                        {categoryDisplayName(q.query_category)}
                      </td>
                    )}
                    <td className="px-5 py-4 font-semibold text-foreground">{q.user_name}</td>
                    <td className="px-5 py-4 font-mono text-muted-foreground text-xs">{q.phone_number}</td>
                    <td className="px-5 py-4">
                      <div className="max-w-[200px] truncate text-foreground/80" title={q.charity_name}>
                        {q.charity_name}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                      {role === 'superadmin' && (
                         <button
                           onClick={(e) => triggerDeleteSingle(q.id, e)}
                           disabled={isDeleting}
                           className="text-red-500 font-medium hover:text-red-700 text-xs disabled:opacity-50 transition-colors duration-150"
                         >
                           Delete
                         </button>
                      )}
                      <Link 
                        href={`/admin/query/${q.id}`} 
                        className="pcc-btn h-8 px-3 text-xs bg-pcc-50 text-pcc-700 border border-pcc-200 hover:bg-pcc-100"
                      >
                        Review &amp; Respond
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.mode !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md p-6 border border-border rounded-lg shadow-xl">
            
            {error && <div className="mb-4 p-3 bg-red-50 text-red-800 text-sm border-l-4 border-red-500 rounded">{error}</div>}

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    Delete {deleteModal.mode === 'bulk' ? 'Complaints' : 'Complaint'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Are you sure you want to permanently delete {deleteModal.mode === 'bulk' ? <strong>{selectedIds.size} selected complaints</strong> : <strong>this complaint</strong>}? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => { setDeleteModal({ mode: 'none' }); setError(null) }} 
                  className="pcc-btn-outline"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDelete} 
                  disabled={isDeleting} 
                  className="pcc-btn-destructive"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
