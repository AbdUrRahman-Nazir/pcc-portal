'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface AdminSidebarNavProps {
  role: string
}

export function AdminSidebarNav({ role }: AdminSidebarNavProps) {
  const pathname = usePathname()

  const links = [
    { 
      href: '/admin/dashboard', 
      label: 'Complaints',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
      )
    },
    ...(role === 'superadmin' ? [{ 
      href: '/admin/users', 
      label: 'Manage Admins',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      )
    }] : [])
  ]

  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors duration-150 text-sm font-medium",
              isActive
                ? "bg-pcc-800 text-white"
                : "text-pcc-400 hover:bg-pcc-900 hover:text-pcc-200"
            )}
          >
            <span className="shrink-0 opacity-80">{link.icon}</span>
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
