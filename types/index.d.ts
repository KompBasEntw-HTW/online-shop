export type CoffeeProductData = {
  id: number
  name: string
  description: string
  flavor: string
  flavorNotes: string
  imageUrl: string
  price: number
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
