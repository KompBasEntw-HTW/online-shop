export type CoffeeProductData = {
  id: number
  name: string
  description: string
  flavor: string
  flavorNotes: FlavorNote[]
  availableBagSizes: BagSize[]
  imageUrl: string
  pricePerKilo: number
  roastLevel: number
  roaster: string
  roasterNotes: string
  location: string
}

type BagSize = {
  id: number
  name: string
  weightInGrams: number
  priceModifier: number
}

type FlavorNote = {
  id: number
  flavorNote: string
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
