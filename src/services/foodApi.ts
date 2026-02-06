// Food API Service - USDA FoodData Central + Open Food Facts

const USDA_API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY
const USDA_BASE = 'https://api.nal.usda.gov/fdc/v1'
const OFF_BASE = 'https://world.openfoodfacts.org'

export interface USDAFood {
  fdcId: number
  description: string
  brandName?: string
  brandOwner?: string
  dataType: string
  foodNutrients: {
    nutrientId: number
    nutrientName: string
    nutrientNumber: string
    unitName: string
    value: number
  }[]
  servingSize?: number
  servingSizeUnit?: string
}

export interface SearchFood {
  id: string
  name: string
  brand: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: number
  servingUnit: string
  source?: 'usda' | 'off'
}

// --- USDA Helpers ---

const NUTRIENT_IDS = {
  ENERGY: 1008,
  PROTEIN: 1003,
  CARBS: 1005,
  FAT: 1004,
}

function extractNutrient(nutrients: USDAFood['foodNutrients'], nutrientId: number): number {
  const nutrient = nutrients.find(n => n.nutrientId === nutrientId)
  return nutrient ? Math.round(nutrient.value) : 0
}

function transformUSDAFood(food: USDAFood): SearchFood {
  const nutrients = food.foodNutrients || []
  const servingSize = food.servingSize || 100
  const servingUnit = food.servingSizeUnit || 'g'
  const scaleFactor = servingSize / 100

  return {
    id: `usda-${food.fdcId}`,
    name: food.description,
    brand: food.brandName || food.brandOwner || 'Generic',
    calories: Math.round(extractNutrient(nutrients, NUTRIENT_IDS.ENERGY) * scaleFactor),
    protein: Math.round(extractNutrient(nutrients, NUTRIENT_IDS.PROTEIN) * scaleFactor),
    carbs: Math.round(extractNutrient(nutrients, NUTRIENT_IDS.CARBS) * scaleFactor),
    fat: Math.round(extractNutrient(nutrients, NUTRIENT_IDS.FAT) * scaleFactor),
    servingSize,
    servingUnit,
    source: 'usda',
  }
}

async function searchUSDA(query: string, pageSize: number): Promise<SearchFood[]> {
  if (!USDA_API_KEY) return []

  try {
    const response = await fetch(`${USDA_BASE}/foods/search?api_key=${USDA_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        pageSize,
        dataType: ['Branded', 'Survey (FNDDS)', 'Foundation', 'SR Legacy'],
        sortBy: 'dataType.keyword',
        sortOrder: 'asc',
      }),
    })

    if (!response.ok) return []

    const data = await response.json()
    if (!data.foods?.length) return []

    return data.foods
      .map((food: USDAFood) => transformUSDAFood(food))
      .filter((food: SearchFood) => food.calories > 0)
  } catch {
    return []
  }
}

async function barcodeUSDA(upc: string): Promise<SearchFood | null> {
  if (!USDA_API_KEY) return null

  try {
    const response = await fetch(`${USDA_BASE}/foods/search?api_key=${USDA_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: upc,
        dataType: ['Branded'],
        pageSize: 5,
      }),
    })

    if (!response.ok) return null

    const data = await response.json()
    if (!data.foods?.length) return null

    const exactMatch = data.foods.find((food: any) =>
      food.gtinUpc === upc || food.upc === upc
    )

    return transformUSDAFood(exactMatch || data.foods[0])
  } catch {
    return null
  }
}

// --- Open Food Facts Helpers ---

interface OFFProduct {
  code: string
  product_name?: string
  brands?: string
  nutriments?: {
    'energy-kcal_100g'?: number
    'energy-kcal_serving'?: number
    proteins_100g?: number
    proteins_serving?: number
    carbohydrates_100g?: number
    carbohydrates_serving?: number
    fat_100g?: number
    fat_serving?: number
  }
  serving_size?: string
  serving_quantity?: number
}

function parseServingSize(product: OFFProduct): { size: number; unit: string } {
  if (product.serving_quantity && product.serving_quantity > 0) {
    return { size: product.serving_quantity, unit: 'g' }
  }

  if (product.serving_size) {
    // Try to parse "30g", "1 cup (240ml)", "100 g", etc.
    const match = product.serving_size.match(/(\d+\.?\d*)\s*(g|ml|oz|cup|tbsp|tsp)?/i)
    if (match) {
      return { size: parseFloat(match[1]), unit: match[2]?.toLowerCase() || 'g' }
    }
  }

  return { size: 100, unit: 'g' }
}

function transformOFFProduct(product: OFFProduct): SearchFood | null {
  const name = product.product_name
  if (!name) return null

  const n = product.nutriments || {}
  const serving = parseServingSize(product)

  // Prefer per-serving values if available, otherwise scale from per-100g
  const hasServing = n['energy-kcal_serving'] != null && n['energy-kcal_serving']! > 0
  let calories: number, protein: number, carbs: number, fat: number

  if (hasServing) {
    calories = Math.round(n['energy-kcal_serving'] || 0)
    protein = Math.round(n['proteins_serving'] || 0)
    carbs = Math.round(n['carbohydrates_serving'] || 0)
    fat = Math.round(n['fat_serving'] || 0)
  } else {
    const scale = serving.size / 100
    calories = Math.round((n['energy-kcal_100g'] || 0) * scale)
    protein = Math.round((n['proteins_100g'] || 0) * scale)
    carbs = Math.round((n['carbohydrates_100g'] || 0) * scale)
    fat = Math.round((n['fat_100g'] || 0) * scale)
  }

  if (calories === 0 && protein === 0 && carbs === 0 && fat === 0) return null

  return {
    id: `off-${product.code}`,
    name,
    brand: product.brands || 'Open Food Facts',
    calories,
    protein,
    carbs,
    fat,
    servingSize: serving.size,
    servingUnit: serving.unit,
    source: 'off',
  }
}

async function searchOFF(query: string, pageSize: number): Promise<SearchFood[]> {
  try {
    const params = new URLSearchParams({
      search_terms: query,
      search_simple: '1',
      action: 'process',
      json: '1',
      page_size: pageSize.toString(),
      fields: 'code,product_name,brands,nutriments,serving_size,serving_quantity',
    })

    const response = await fetch(`${OFF_BASE}/cgi/search.pl?${params}`)
    if (!response.ok) return []

    const data = await response.json()
    if (!data.products?.length) return []

    return data.products
      .map((p: OFFProduct) => transformOFFProduct(p))
      .filter((f: SearchFood | null): f is SearchFood => f !== null)
  } catch {
    return []
  }
}

async function barcodeOFF(upc: string): Promise<SearchFood | null> {
  try {
    const response = await fetch(`${OFF_BASE}/api/v2/product/${upc}?fields=code,product_name,brands,nutriments,serving_size,serving_quantity`)
    if (!response.ok) return null

    const data = await response.json()
    if (data.status !== 1 || !data.product) return null

    return transformOFFProduct(data.product)
  } catch {
    return null
  }
}

// --- Combined Public API ---

export async function searchFoods(query: string, pageSize: number = 15): Promise<SearchFood[]> {
  if (!query.trim()) return []

  // Search both sources in parallel
  const [usdaResults, offResults] = await Promise.all([
    searchUSDA(query, Math.ceil(pageSize / 2)),
    searchOFF(query, Math.ceil(pageSize / 2)),
  ])

  // Interleave results: USDA first for generic foods, OFF for branded
  const combined: SearchFood[] = []
  const seen = new Set<string>()

  // Add USDA results first (better generic/whole food data)
  for (const food of usdaResults) {
    const key = food.name.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      combined.push(food)
    }
  }

  // Add OFF results (branded items USDA might miss)
  for (const food of offResults) {
    const key = food.name.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      combined.push(food)
    }
  }

  return combined.slice(0, pageSize)
}

export async function getFoodDetails(id: string): Promise<SearchFood | null> {
  if (id.startsWith('off-')) {
    return barcodeOFF(id.replace('off-', ''))
  }

  const fdcId = id.replace('usda-', '')
  if (!USDA_API_KEY) return null

  try {
    const response = await fetch(`${USDA_BASE}/food/${fdcId}?api_key=${USDA_API_KEY}`)
    if (!response.ok) return null

    const food: USDAFood = await response.json()
    return transformUSDAFood(food)
  } catch {
    return null
  }
}

// Barcode: try Open Food Facts first (much better barcode coverage), fallback to USDA
export async function searchByBarcode(upc: string): Promise<SearchFood | null> {
  if (!upc.trim()) return null

  // OFF has far better barcode/UPC coverage
  const offResult = await barcodeOFF(upc)
  if (offResult) return offResult

  // Fallback to USDA
  return barcodeUSDA(upc)
}
