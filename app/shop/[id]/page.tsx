'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

interface PageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: PageProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (response.ok) {
          setProduct(await response.json())
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleAddToCart = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setAdding(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product?.id,
          quantity,
        }),
      })

      if (response.ok) {
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product not found</h1>
          <Link href="/shop" className="text-accent hover:underline">
            Back to shop
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
          <Link href="/shop" className="text-muted-foreground hover:text-foreground">
            Back to Shop
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-secondary/20 rounded-lg flex items-center justify-center h-96 overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground">No image</span>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-4">
              <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm mb-4">
                {product.category}
              </span>
              {!product.inStock && (
                <span className="inline-block bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm ml-2">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl text-accent font-bold mb-6">
              ${(product.price / 100).toFixed(2)}
            </p>

            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              {product.description}
            </p>

            {product.inStock && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="bg-secondary/30 hover:bg-secondary/50 rounded px-4 py-2 transition"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="bg-secondary/30 hover:bg-secondary/50 rounded px-4 py-2 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="w-full bg-accent text-accent-foreground font-bold py-3 rounded hover:bg-accent/90 disabled:opacity-50 transition"
                >
                  {adding ? 'Adding...' : added ? 'Added to Cart!' : 'Add to Cart'}
                </button>

                <Link
                  href="/cart"
                  className="block w-full bg-primary text-primary-foreground font-bold py-3 rounded hover:bg-primary/90 transition text-center"
                >
                  Go to Cart
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
