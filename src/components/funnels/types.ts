export interface FunnelData {
  id: string
  slug: string
  template: string
  problem_heading: string | null
  problem_body: string | null
  amplify_heading: string | null
  amplify_body: string | null
  story_heading: string | null
  story_body_html: string | null
  transformation_heading: string | null
  transformation_body: string | null
  offer_heading: string | null
  offer_original_description: string | null
  offer_print_description: string | null
  risk_reversal_heading: string | null
  risk_reversal_body: string | null
  final_cta_text: string | null
}

export interface ProductData {
  id: string
  title: string
  slug: string
  description_html: string | null
  story_html: string | null
  medium: string | null
  dimensions: string | null
  base_price: number
  is_original: boolean
  prints_enabled: boolean
}

export interface ImageData {
  id: string
  url: string
  alt_text: string | null
}

export interface VariantData {
  id: string
  name: string
  price: number
  variant_type: string
  inventory_count: number
}

export interface FunnelTemplateProps {
  funnel: FunnelData
  product: ProductData
  images: ImageData[]
  variants: VariantData[]
}
