'use client'

import ProductForm from '@/app/admin/products/new/page'

export default function EditProductPage({ params }: { params: { id: string } }) {
  return <ProductForm params={params} />
}
