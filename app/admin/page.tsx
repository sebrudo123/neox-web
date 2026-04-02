'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  totalProducts: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { data: stats } = useSWR<DashboardStats>(
    session?.user?.role === 'admin' ? '/api/admin/stats' : null,
    fetcher
  )

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don&apos;t have permission to access this page</p>
          <Link href="/" className="text-accent hover:underline">
            Go Home
          </Link>
        </div>
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
          <div className="flex gap-4 items-center">
            <span className="text-sm text-muted-foreground">
              {session?.user?.email}
            </span>
            <Link href="/api/auth/signout" className="text-muted-foreground hover:text-foreground">
              Sign out
            </Link>
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="hidden md:block space-y-4">
          <h3 className="font-bold text-lg">Navigation</h3>
          <nav className="space-y-2">
            <Link
              href="/admin"
              className="block px-4 py-2 bg-primary/20 text-primary rounded hover:bg-primary/30"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="block px-4 py-2 rounded hover:bg-secondary/30"
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="block px-4 py-2 rounded hover:bg-secondary/30"
            >
              Orders
            </Link>
            <Link
              href="/admin/users"
              className="block px-4 py-2 rounded hover:bg-secondary/30"
            >
              Users
            </Link>
            <Link
              href="/"
              className="block px-4 py-2 rounded hover:bg-secondary/30"
            >
              Back to Shop
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-secondary/20 border border-border rounded-lg p-6">
              <h3 className="text-muted-foreground text-sm font-medium mb-2">
                Total Products
              </h3>
              <p className="text-3xl font-bold text-accent">
                {stats?.totalProducts || 0}
              </p>
            </div>

            <div className="bg-secondary/20 border border-border rounded-lg p-6">
              <h3 className="text-muted-foreground text-sm font-medium mb-2">
                Total Orders
              </h3>
              <p className="text-3xl font-bold text-primary">
                {stats?.totalOrders || 0}
              </p>
            </div>

            <div className="bg-secondary/20 border border-border rounded-lg p-6">
              <h3 className="text-muted-foreground text-sm font-medium mb-2">
                Pending Orders
              </h3>
              <p className="text-3xl font-bold text-yellow-400">
                {stats?.pendingOrders || 0}
              </p>
            </div>

            <div className="bg-secondary/20 border border-border rounded-lg p-6">
              <h3 className="text-muted-foreground text-sm font-medium mb-2">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold text-green-400">
                ${((stats?.totalRevenue || 0) / 100).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-secondary/20 border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/admin/products/new"
                className="bg-accent text-accent-foreground px-6 py-3 rounded font-medium hover:bg-accent/90 transition text-center"
              >
                Add New Product
              </Link>
              <Link
                href="/admin/orders"
                className="bg-primary text-primary-foreground px-6 py-3 rounded font-medium hover:bg-primary/90 transition text-center"
              >
                View All Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
