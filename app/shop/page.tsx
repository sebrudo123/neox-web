'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  inStock: boolean
  quantity: number
}

export default function ShopPage() {
  const { data: session } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          setProducts(await response.json())
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const categories = ['all', ...new Set(products.map((p) => p.category))]
  const filteredProducts =
    filter === 'all' ? products : products.filter((p) => p.category === filter)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="bg-secondary/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-accent">
            Trinitaria RP
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-muted-foreground hover:text-foreground">
              Cart
            </Link>
            {session?.user?.role === 'admin' && (
              <Link href="/admin" className="text-primary hover:underline">
                Admin
              </Link>
            )}
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Back
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8">Shop</h1>

        {/* Category Filter */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded whitespace-nowrap transition ${
                filter === cat
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary/20 text-foreground hover:bg-secondary/30'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="bg-secondary/20 border border-border rounded-lg overflow-hidden hover:border-accent transition group"
              >
                {product.image && (
                  <div className="bg-secondary/40 h-48 overflow-hidden flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-accent font-bold">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                    {!product.inStock && (
                      <span className="text-red-400 text-sm">Out of Stock</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
