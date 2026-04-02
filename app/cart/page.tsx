'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image?: string
  }
}

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { data: cartItems, mutate } = useSWR<CartItem[]>(
    session ? '/api/cart' : null,
    fetcher
  )
  const [loading, setLoading] = useState(false)

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please sign in to view cart</h1>
          <Link href="/auth/signin" className="text-accent hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const removeItem = async (cartItemId: string) => {
    try {
      const response = await fetch(`/api/cart?id=${cartItemId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        mutate()
      }
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const total =
    cartItems?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }),
      })

      if (response.ok) {
        const { url } = await response.json()
        router.push(url)
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {!cartItems || cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Link href="/shop" className="text-accent hover:underline">
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-secondary/20 border border-border rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-bold">{item.product.name}</h3>
                      <p className="text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ${(item.product.price * item.quantity / 100).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-300 text-sm mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-secondary/20 border border-border rounded-lg p-6">
              <div className="flex justify-between items-center mb-4 text-xl font-bold">
                <span>Total:</span>
                <span className="text-accent">${(total / 100).toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-accent text-accent-foreground font-bold py-3 rounded hover:bg-accent/90 disabled:opacity-50 transition"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
