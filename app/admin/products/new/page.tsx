'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface ProductFormProps {
  params?: {
    id: string
  }
}

export default function ProductForm({ params }: ProductFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')
  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!params?.id

  useEffect(() => {
    if (isEdit && params?.id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${params.id}`)
          if (response.ok) {
            const product = await response.json()
            setName(product.name)
            setDescription(product.description)
            setPrice((product.price / 100).toString())
            setCategory(product.category)
            setImage(product.image || '')
            setQuantity(product.quantity.toString())
          }
        } catch {
          setError('Failed to load product')
        }
      }
      fetchProduct()
    }
  }, [isEdit, params?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = {
        name,
        description,
        price: parseFloat(price),
        category,
        image,
        quantity: parseInt(quantity),
      }

      let response

      if (isEdit && params?.id) {
        response = await fetch(`/api/products/${params.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      } else {
        response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      }

      if (response.ok) {
        router.push('/admin/products')
      } else {
        setError('Failed to save product')
      }
    } catch {
      setError('An error occurred')
    } finally {
      setLoading(false)
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/admin" className="text-2xl font-bold text-accent">
            Admin Panel
          </Link>
          <Link href="/admin/products" className="text-accent hover:underline">
            Back to Products
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">
          {isEdit ? 'Edit Product' : 'Add Product'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded">
              {error}
            </div>
          )}

          <div className="bg-secondary/20 border border-border rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-input border border-border rounded px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-input border border-border rounded px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-input border border-border rounded px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-input border border-border rounded px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g. Weapons, Vehicles, Cosmetics"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-input border border-border rounded px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-input border border-border rounded px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {image && (
              <div className="border border-border rounded p-4">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <img
                  src={image}
                  alt="Preview"
                  className="w-full max-h-48 object-cover rounded"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-accent text-accent-foreground font-bold px-6 py-2 rounded hover:bg-accent/90 disabled:opacity-50 transition"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <Link
              href="/admin/products"
              className="bg-secondary/30 text-foreground font-bold px-6 py-2 rounded hover:bg-secondary/50 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
