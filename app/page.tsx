import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

async function getProducts() {
  try {
    const response = await fetch('http://localhost:3000/api/products', {
      cache: 'no-store',
    })
    if (!response.ok) return []
    return response.json()
  } catch {
    return []
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions)
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="bg-secondary/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-accent">
              Trinitaria RP
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/shop" className="text-muted-foreground hover:text-foreground transition">
                Shop
              </Link>
              <Link href="/orders" className="text-muted-foreground hover:text-foreground transition">
                Orders
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-muted-foreground hover:text-foreground transition">
              Cart
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="text-accent hover:underline">
                  Dashboard
                </Link>
                {session.user?.role === 'admin' && (
                  <Link href="/admin" className="text-primary hover:underline">
                    Admin
                  </Link>
                )}
                <Link href="/api/auth/signout" className="text-muted-foreground hover:text-foreground transition">
                  Sign out
                </Link>
              </>
            ) : (
              <Link href="/auth/signin" className="bg-accent text-accent-foreground px-4 py-2 rounded hover:bg-accent/90 transition">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary/50 to-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Trinitaria RP</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Purchase in-game items and services for the ultimate roleplay experience
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/shop" className="bg-accent text-accent-foreground px-6 py-3 rounded font-medium hover:bg-accent/90 transition">
              Shop Now
            </Link>
            {!session && (
              <Link href="/auth/signup" className="bg-primary text-primary-foreground px-6 py-3 rounded font-medium hover:bg-primary/90 transition">
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Items</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No products available yet</p>
            {session?.user?.role === 'admin' && (
              <Link href="/admin/products" className="text-accent hover:underline">
                Add products from admin panel
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.slice(0, 8).map((product: any) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="bg-secondary/20 border border-border rounded-lg p-4 hover:border-accent transition group"
              >
                {product.image && (
                  <div className="bg-secondary/40 h-40 rounded mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                  </div>
                )}
                <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-accent font-bold">${(product.price / 100).toFixed(2)}</span>
                  {!product.inStock && <span className="text-red-400 text-sm">Out of Stock</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-secondary/20 border-t border-border mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; 2024 Trinitaria RP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
