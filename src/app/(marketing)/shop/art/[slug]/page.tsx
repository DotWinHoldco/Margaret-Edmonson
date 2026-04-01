import { getProductBySlug, getProducts } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/shop/ProductDetail'
import type { Metadata } from 'next'

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }

  return {
    title: product.seo_title || product.title,
    description: product.seo_description || `${product.title} — ${product.medium || 'Fine Art'} by Margaret Edmondson`,
  }
}

export default async function ProductPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const { products: related } = await getProducts({ limit: 4 })
  const relatedProducts = related.filter((p) => p.id !== product.id).slice(0, 4)

  return <ProductDetail product={product} relatedProducts={relatedProducts} />
}
