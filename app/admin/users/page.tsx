'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface User {
  id: string
  email: string
  username: string
  role: string
  createdAt: string
}

export default function AdminUsers() {
  const { data: session } = useSession()
  const { data: users } = useSWR<User[]>(
    session?.user?.role === 'admin' ? '/api/admin/users' : null,
    fetcher
  )

  if (session?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>Access denied</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="bg-secondary/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/admin" className="text-2xl font-bold text-accent">
            Admin Panel
          </Link>
          <Link href="/api/auth/signout" className="text-muted-foreground hover:text-foreground">
            Sign out
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Users</h1>

        {!users || users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No users yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-bold">Username</th>
                  <th className="text-left py-4 px-4 font-bold">Email</th>
                  <th className="text-left py-4 px-4 font-bold">Role</th>
                  <th className="text-left py-4 px-4 font-bold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-secondary/10">
                    <td className="py-4 px-4">{user.username || '—'}</td>
                    <td className="py-4 px-4">{user.email}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded text-sm ${
                          user.role === 'admin'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-secondary/30 text-foreground'
                        }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
