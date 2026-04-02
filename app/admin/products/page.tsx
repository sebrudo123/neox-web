'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import useSWR from 'swr'
import { useState } from 'react'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

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

export default function AdminProducts() {
  const { data: session } = useSession()
  const { data: products, mutate } = useSWR<Product[]>(
    session?.user?.role === 'admin' ? '/api/admin/products' : null,
    fetcher
  )
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    setDeleting(productId)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        mutate()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    } finally {
      setDeleting(null)
    }
  }

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Products</h1>
          <Link
            href="/admin/products/new"
            className="bg-accent text-accent-foreground px-6 py-2 rounded font-medium hover:bg-accent/90"
          >
            Add Product
          </Link>
        </div>

        {!products || products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No products yet</p>
            <Link href="/admin/products/new" className="text-accent hover:underline">
              Create the first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-bold">Name</th>
                  <th className="text-left py-4 px-4 font-bold">Category</th>
                  <th className="text-left py-4 px-4 font-bold">Price</th>
                  <th className="text-left py-4 px-4 font-bold">Quantity</th>
                  <th className="text-left py-4 px-4 font-bold">Stock</th>
                  <th className="text-left py-4 px-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-secondary/10">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{product.category}</td>
                    <td className="py-4 px-4">${(product.price / 100).toFixed(2)}</td>
                    <td className="py-4 px-4">{product.quantity}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded text-sm ${
                          product.inStock
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-accent hover:underline text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          className="text-red-400 hover:text-red-300 text-sm disabled:opacity-50"
                        >
                          {deleting === product.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
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
