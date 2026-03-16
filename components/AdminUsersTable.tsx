'use client'

import { useState } from 'react'
import { createUserAction, updateUserRoleAction, deleteUserAction } from '@/app/actions/users'
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
  { value: 'misc', label: 'Miscellaneous Admin' },
  { value: 'superadmin', label: 'Super Admin' },
]

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
    const result = await updateUserRoleAction(selectedUser.id, new FormData(e.currentTarget))
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
        <button onClick={() => { setModal('add'); setError(null) }} className="sleek-button-primary bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm">
          + Add New Admin
        </button>
      </div>

      <div className="sleek-card bg-white overflow-hidden shadow-sm border-zinc-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Created On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((u) => {
                const role = u.app_metadata?.role || 'none'
                return (
                  <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-sm capitalize">
                        {role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => openEdit(u)} className="text-blue-600 font-medium hover:underline">Edit Role</button>
                      <button 
                        onClick={() => openDelete(u)} 
                        disabled={u.id === currentUserId}
                        className="text-red-600 font-medium hover:underline disabled:opacity-30 disabled:hover:no-underline"
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

      {modal !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md p-6 border border-zinc-200 shadow-lg">
            
            {error && <div className="mb-4 p-3 bg-red-50 text-red-800 text-sm border-l-2 border-red-500">{error}</div>}

            {modal === 'add' && (
              <form onSubmit={handleAdd} className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight mb-4">Add New Admin</h3>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input type="email" name="email" required className="sleek-input" placeholder="admin@pcc.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Temporary Password</label>
                  <input type="password" name="password" required className="sleek-input" minLength={6} placeholder="Min 6 characters" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Assign Role</label>
                  <select name="role" required className="sleek-input bg-white">
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button type="button" onClick={close} className="sleek-button-outline">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="sleek-button-primary">{isSubmitting ? 'Adding...' : 'Add Admin'}</button>
                </div>
              </form>
            )}

            {modal === 'edit' && selectedUser && (
              <form onSubmit={handleEdit} className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight mb-4">Edit Role for {selectedUser.email}</h3>
                <div>
                  <label className="block text-sm font-semibold mb-1">Role</label>
                  <select name="role" required defaultValue={selectedUser.app_metadata?.role || 'misc'} className="sleek-input bg-white">
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button type="button" onClick={close} className="sleek-button-outline">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="sleek-button-primary">{isSubmitting ? 'Saving...' : 'Save Role'}</button>
                </div>
              </form>
            )}

            {modal === 'delete' && selectedUser && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight mb-2 text-red-600">Delete Admin</h3>
                <p className="text-sm text-zinc-600">Are you absolutely sure you want to permanently delete <strong>{selectedUser.email}</strong>? They will instantly lose access.</p>
                <div className="flex justify-end space-x-3 mt-6">
                  <button type="button" onClick={close} className="sleek-button-outline">Cancel</button>
                  <button onClick={handleDelete} disabled={isSubmitting} className="sleek-button bg-red-600 text-white hover:bg-red-700">{isSubmitting ? 'Deleting...' : 'Yes, Delete User'}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
