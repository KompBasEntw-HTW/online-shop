export type CoffeeProductData = {
  id: number
  name: string
  description: string
  flavor: string
  imageUrl: string
  price: number
  availableBagSizes: {
    id: number
    name: string
    priceModifier: number
    weightInGrams: number
  }[]
  flavorNotes: {
    id: number
    flavorNote: string
  }[]
  roastLevel: number
  roaster: string
  roasterNotes: string
  location: string
}

export type FilterOption = {
  value: string
  name: string
}

export type ProductFilter = {
  id: string
  name: string
  options: FilterOption[]
}
