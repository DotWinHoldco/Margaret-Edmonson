const API_KEY = process.env.SHIPSTATION_API_KEY!
const BASE_URL = process.env.SHIPSTATION_BASE_URL || 'https://ssapi.shipstation.com/v2'

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'API-Key': API_KEY,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    const error = await res.text()
    throw new Error(`ShipStation API error (${res.status}): ${error}`)
  }
  return res.json()
}

export async function getRates(shipment: {
  carrier_id?: string
  from_postal_code: string
  from_country_code: string
  to_postal_code: string
  to_country_code: string
  weight: { value: number; unit: 'pound' | 'ounce' }
  dimensions?: { length: number; width: number; height: number; unit: 'inch' }
}) {
  return request('/rates', {
    method: 'POST',
    body: JSON.stringify({ rate_options: shipment }),
  })
}

export async function createLabel(shipment: {
  carrier_id: string
  service_code: string
  ship_to: {
    name: string
    address_line1: string
    address_line2?: string
    city_locality: string
    state_province: string
    postal_code: string
    country_code: string
  }
  ship_from: {
    name: string
    address_line1: string
    city_locality: string
    state_province: string
    postal_code: string
    country_code: string
  }
  packages: Array<{
    weight: { value: number; unit: 'pound' | 'ounce' }
    dimensions?: { length: number; width: number; height: number; unit: 'inch' }
  }>
}) {
  return request('/labels', {
    method: 'POST',
    body: JSON.stringify(shipment),
  })
}

export async function getTracking(labelId: string) {
  return request(`/labels/${labelId}/track`)
}

export async function validateAddress(address: {
  address_line1: string
  address_line2?: string
  city_locality: string
  state_province: string
  postal_code: string
  country_code: string
}) {
  return request('/addresses/validate', {
    method: 'POST',
    body: JSON.stringify([address]),
  })
}
