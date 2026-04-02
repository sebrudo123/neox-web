'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please sign in</h1>
          <Link href="/auth/signin" className="text-accent hover:underline">
            Sign In
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
          <Link href="/" className="text-2xl font-bold text-accent">
            Trinitaria RP
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {session?.user?.email}
            </span>
            {session?.user?.role === 'admin' && (
              <Link href="/admin" className="text-primary hover:underline">
                Admin Panel
              </Link>
            )}
            <Link href="/api/auth/signout" className="text-muted-foreground hover:text-foreground">
              Sign out
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8">Welcome, {session?.user?.email}!</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Links */}
          <div className="bg-secondary/20 border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
            <div className="space-y-2">
              <Link href="/shop" className="block text-accent hover:underline">
                Browse Shop
              </Link>
              <Link href="/cart" className="block text-accent hover:underline">
                View Cart
              </Link>
              <Link href="/orders" className="block text-accent hover:underline">
                My Orders
              </Link>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-secondary/20 border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Account Info</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Email:</span> {session?.user?.email}
              </p>
              <p>
                <span className="font-medium text-foreground">Role:</span> {session?.user?.role}
              </p>
              <p>
                <span className="font-medium text-foreground">Account ID:</span>{' '}
                {session?.user?.id?.slice(-8)}
              </p>
            </div>
          </div>

          {/* Support */}
          <div className="bg-secondary/20 border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Contact our support team or visit our FAQ for assistance with your account or orders.
            </p>
            <button
              onClick={() => alert('Contact support at: support@trinitariarp.com')}
              className="w-full bg-accent text-accent-foreground px-4 py-2 rounded hover:bg-accent/90 transition"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
