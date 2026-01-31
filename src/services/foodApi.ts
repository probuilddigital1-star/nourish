// USDA FoodData Central API Service

const API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1'

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
}

// Nutrient IDs from USDA
const NUTRIENT_IDS = {
  ENERGY: 1008, // kcal
  PROTEIN: 1003, // g
  CARBS: 1005, // g (carbohydrate by difference)
  FAT: 1004, // g (total lipid)
}

function extractNutrient(nutrients: USDAFood['foodNutrients'], nutrientId: number): number {
  const nutrient = nutrients.find(n => n.nutrientId === nutrientId)
  return nutrient ? Math.round(nutrient.value) : 0
}

function transformUSDAFood(food: USDAFood): SearchFood {
  const nutrients = food.foodNutrients || []

  // Default serving size - USDA values are per 100g
  const servingSize = food.servingSize || 100
  const servingUnit = food.servingSizeUnit || 'g'

  // Calculate nutrient values (USDA provides per 100g, scale to serving size)
  const scaleFactor = servingSize / 100

  return {
    id: food.fdcId.toString(),
    name: food.description,
    brand: food.brandName || food.brandOwner || 'Generic',
    calories: Math.round(extractNutrient(nutrients, NUTRIENT_IDS.ENERGY) * scaleFactor),
    protein: Math.round(extractNutrient(nutrients, NUTRIENT_IDS.PROTEIN) * scaleFactor),
    carbs: Math.round(extractNutrient(nutrients, NUTRIENT_IDS.CARBS) * scaleFactor),
    fat: Math.round(extractNutrient(nutrients, NUTRIENT_IDS.FAT) * scaleFactor),
    servingSize,
    servingUnit,
  }
}

export async function searchFoods(query: string, pageSize: number = 15): Promise<SearchFood[]> {
  if (!API_KEY) {
    console.error('USDA API key not configured')
    return []
  }

  if (!query.trim()) {
    return []
  }

  try {
    const response = await fetch(`${BASE_URL}/foods/search?api_key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        pageSize: pageSize,
        dataType: ['Branded', 'Survey (FNDDS)', 'Foundation', 'SR Legacy'],
        sortBy: 'dataType.keyword',
        sortOrder: 'asc',
      }),
    })

    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.foods || data.foods.length === 0) {
      return []
    }

    // Transform and filter results
    const foods = data.foods
      .map((food: USDAFood) => transformUSDAFood(food))
      .filter((food: SearchFood) => food.calories > 0) // Filter out foods with no calorie data

    return foods
  } catch (error) {
    console.error('Error searching foods:', error)
    return []
  }
}

// Get detailed nutrition info for a specific food
export async function getFoodDetails(fdcId: string): Promise<SearchFood | null> {
  if (!API_KEY) {
    console.error('USDA API key not configured')
    return null
  }

  try {
    const response = await fetch(`${BASE_URL}/food/${fdcId}?api_key=${API_KEY}`)

    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status}`)
    }

    const food: USDAFood = await response.json()
    return transformUSDAFood(food)
  } catch (error) {
    console.error('Error fetching food details:', error)
    return null
  }
}

// Look up food by UPC/barcode
export async function searchByBarcode(upc: string): Promise<SearchFood | null> {
  if (!API_KEY) {
    console.error('USDA API key not configured')
    return null
  }

  if (!upc.trim()) {
    return null
  }

  try {
    // Search for the UPC in branded foods
    const response = await fetch(`${BASE_URL}/foods/search?api_key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: upc,
        dataType: ['Branded'],
        pageSize: 5,
      }),
    })

    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.foods || data.foods.length === 0) {
      return null
    }

    // Find exact UPC match if possible
    const exactMatch = data.foods.find((food: any) =>
      food.gtinUpc === upc || food.upc === upc
    )

    const food = exactMatch || data.foods[0]
    return transformUSDAFood(food)
  } catch (error) {
    console.error('Error looking up barcode:', error)
    return null
  }
}
