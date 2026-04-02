import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
        image: true,
        inStock: true,
        quantity: true,
      },
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, price, category, image, quantity } = await req.json()

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Math.round(price * 100), // Store in cents
        category,
        image,
        quantity,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
