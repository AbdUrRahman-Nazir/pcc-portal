'use client'

import { useState } from 'react'
import { createUserAction, updateAdminUserAction, deleteUserAction } from '@/app/actions/users'
import { User } from '@supabase/supabase-js'

interface AdminUsersTableProps {
  users: User[]
  currentUserId: string
}

type ModalState = 'none' | 'add' | 'edit' | 'delete'

const ROLES = [
  { value: 'registration', label: 'Registration Admin' },
  { value: 'renewal', label: 'Renewal Admin' },
  { value: 'observation', label: 'Observation Admin' },
  { value: 'misc', label: 'General Admin' },
  { value: 'superadmin', label: 'Super Admin' },
]

function roleDisplayName(role: string) {
  const found = ROLES.find(r => r.value === role)
  return found ? found.label : role
}

export function AdminUsersTable({ users, currentUserId }: AdminUsersTableProps) {
  const [modal, setModal] = useState<ModalState>('none')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function openEdit(u: User) {
    setSelectedUser(u)
    setModal('edit')
    setError(null)
  }

  function openDelete(u: User) {
    setSelectedUser(u)
    setModal('delete')
    setError(null)
  }

  function close() {
    setModal('none')
    setSelectedUser(null)
    setError(null)
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    const result = await createUserAction(new FormData(e.currentTarget))
    if (result.error) setError(result.error)
    else close()
    setIsSubmitting(false)
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedUser) return
    setIsSubmitting(true)
    setError(null)
    const result = await updateAdminUserAction(selectedUser.id, new FormData(e.currentTarget))
    if (result.error) setError(result.error)
    else close()
    setIsSubmitting(false)
  }

  async function handleDelete() {
    if (!selectedUser) return
    setIsSubmitting(true)
    setError(null)
    const result = await deleteUserAction(selectedUser.id)
    if (result.error) setError(result.error)
    else close()
    setIsSubmitting(false)
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => { setModal('add'); setError(null) }} className="pcc-btn-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          Add New Admin
        </button>
      </div>

      <div className="pcc-card bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-pcc-50/50 border-b border-border text-muted-foreground font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Created On</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {users.map((u) => {
                const role = u.app_metadata?.role || 'none'
                return (
                  <tr key={u.id} className="hover:bg-accent/30 transition-colors duration-100">
                    <td className="px-6 py-4 font-medium text-foreground">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-pcc-50 text-pcc-700 border border-pcc-200 rounded-md capitalize">
                        {roleDisplayName(role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{new Date(u.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => openEdit(u)} className="text-pcc-600 font-medium hover:text-pcc-800 text-sm transition-colors duration-150">Edit</button>
                      <button 
                        onClick={() => openDelete(u)} 
                        disabled={u.id === currentUserId}
                        className="text-red-500 font-medium hover:text-red-700 disabled:opacity-30 text-sm transition-colors duration-150"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {modal !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md p-6 border border-border rounded-lg shadow-xl">
            
            {error && <div className="mb-4 p-3 bg-red-50 text-red-800 text-sm border-l-4 border-red-500 rounded">{error}</div>}

            {modal === 'add' && (
              <form onSubmit={handleAdd} className="space-y-4">
                <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pcc-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                  Add New Admin
                </h3>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Email</label>
                  <input type="email" name="email" required className="pcc-input" placeholder="admin@pcc.punjab.gov.pk" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Temporary Password</label>
                  <input type="password" name="password" required className="pcc-input" minLength={6} placeholder="Min 6 characters" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Assign Role</label>
                  <select name="role" required className="pcc-input bg-white">
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button type="button" onClick={close} className="pcc-btn-outline">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="pcc-btn-primary">{isSubmitting ? 'Adding...' : 'Add Admin'}</button>
                </div>
              </form>
            )}

            {modal === 'edit' && selectedUser && (
              <form onSubmit={handleEdit} className="space-y-4">
                <h3 className="text-lg font-bold tracking-tight">Edit Admin</h3>
                <p className="text-sm text-muted-foreground -mt-2">{selectedUser.email}</p>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Email <span className="text-muted-foreground font-normal">(Optional)</span></label>
                  <input type="email" name="email" defaultValue={selectedUser.email} className="pcc-input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">New Password <span className="text-muted-foreground font-normal">(Leave blank to keep current)</span></label>
                  <input type="password" name="password" minLength={6} className="pcc-input" placeholder="Min 6 characters" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Role</label>
                  <select name="role" required defaultValue={selectedUser.app_metadata?.role || 'misc'} className="pcc-input bg-white">
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button type="button" onClick={close} className="pcc-btn-outline">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="pcc-btn-primary">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </form>
            )}

            {modal === 'delete' && selectedUser && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" x2="23" y1="11" y2="11"/></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-foreground">Delete Admin</h3>
                    <p className="text-sm text-muted-foreground mt-1">Are you sure you want to permanently delete <strong>{selectedUser.email}</strong>? They will instantly lose access.</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button type="button" onClick={close} className="pcc-btn-outline">Cancel</button>
                  <button onClick={handleDelete} disabled={isSubmitting} className="pcc-btn-destructive">{isSubmitting ? 'Deleting...' : 'Yes, Delete User'}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
