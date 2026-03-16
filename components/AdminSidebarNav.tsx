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
    { href: '/admin/dashboard', label: 'Dashboard' },
    ...(role === 'superadmin' ? [{ href: '/admin/users', label: 'Manage Admins' }] : [])
  ]

  return (
    <nav className="flex-1 px-4 py-4 space-y-2">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block px-4 py-3 rounded-sm transition-colors text-sm font-medium",
              isActive
                ? "bg-white/10 text-white font-semibold"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
