'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { deleteAdminQueriesAction } from '@/app/actions/admin'

interface AdminDashboardTableProps {
  initialQueries: any[]
  role: string
}

export function AdminDashboardTable({ initialQueries, role }: AdminDashboardTableProps) {
  const [queries, setQueries] = useState(initialQueries)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ mode: 'single' | 'bulk' | 'none', id?: string }>({ mode: 'none' })
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const filteredQueries = useMemo(() => {
    if (categoryFilter === 'all') return queries
    return queries.filter(q => q.query_category === categoryFilter)
  }, [queries, categoryFilter])

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
      {/* Super Admin Top Bar Controls */}
      {role === 'superadmin' && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 bg-white p-4 sleek-card border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-sm font-semibold text-zinc-700 whitespace-nowrap">Filter Department:</label>
            <select 
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setSelectedIds(new Set()) // Reset selection on filter change
              }}
              className="sleek-input bg-zinc-50 py-1.5 h-auto text-sm"
            >
              <option value="all">All Departments</option>
              <option value="registration">Registration</option>
              <option value="renewal">Renewal</option>
              <option value="observation">Observation</option>
              <option value="misc">Miscellaneous</option>
            </select>
          </div>

          <div className="w-full sm:w-auto flex justify-end">
            <button
              onClick={triggerDeleteSelected}
              disabled={selectedIds.size === 0 || isDeleting}
              className="px-4 py-2 bg-red-600/10 text-red-700 hover:bg-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-sm rounded-sm border border-red-200"
            >
              {isDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.size})`}
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="sleek-card bg-white overflow-hidden border-zinc-200 shadow-sm mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-100 border-b border-zinc-200 text-zinc-600 font-semibold uppercase text-xs tracking-wider">
              <tr>
                {role === 'superadmin' && (
                  <th className="px-6 py-4 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded-sm border-zinc-300 text-zinc-900 focus:ring-zinc-900 w-4 h-4 cursor-pointer"
                      checked={filteredQueries.length > 0 && selectedIds.size === filteredQueries.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                )}
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
              {filteredQueries.length === 0 ? (
                <tr>
                  <td colSpan={role === 'superadmin' ? 8 : 7} className="px-6 py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-zinc-300 text-4xl mb-2">Inbox Empty</span>
                      <p>You have no queries matching these filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQueries.map((q: any) => (
                  <tr key={q.id} className="hover:bg-zinc-50 transition-colors group cursor-default">
                    {role === 'superadmin' && (
                      <td className="px-6 py-5">
                        <input 
                          type="checkbox"
                          className="rounded-sm border-zinc-300 text-zinc-900 focus:ring-zinc-900 w-4 h-4 cursor-pointer"
                          checked={selectedIds.has(q.id)}
                          onChange={() => toggleSelect(q.id)}
                        />
                      </td>
                    )}
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
                    <td className="px-6 py-5 text-right space-x-3 whitespace-nowrap">
                      {role === 'superadmin' && (
                         <button
                           onClick={(e) => triggerDeleteSingle(q.id, e)}
                           disabled={isDeleting}
                           className="text-red-500 font-medium hover:underline text-sm disabled:opacity-50"
                         >
                           Delete
                         </button>
                      )}
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

      {deleteModal.mode !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md p-6 border border-zinc-200 shadow-lg">
            
            {error && <div className="mb-4 p-3 bg-red-50 text-red-800 text-sm border-l-2 border-red-500">{error}</div>}

            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-tight mb-2 text-red-600">
                Delete {deleteModal.mode === 'bulk' ? 'Queries' : 'Query'}
              </h3>
              <p className="text-sm text-zinc-600">
                Are you absolutely sure you want to permanently delete {deleteModal.mode === 'bulk' ? <strong>{selectedIds.size} selected queries</strong> : <strong>this query</strong>}? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => { setDeleteModal({ mode: 'none' }); setError(null) }} 
                  className="sleek-button-outline"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDelete} 
                  disabled={isDeleting} 
                  className="sleek-button bg-red-600 text-white hover:bg-red-700"
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
