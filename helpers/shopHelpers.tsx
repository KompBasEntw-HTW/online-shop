import { CheckboxFilterType, Coffee, FilterOption, SelectedFilterOptions } from '../types'

export const getFilterOptions = (products: Coffee[], filter: CheckboxFilterType) => {
  // Handle the filter extraction for flavor notes
  if (filter.id === 'flavorNotes') {
    return products
      .reduce<FilterOption[]>((options, product) => {
        // Check if the product object has a property with the same ID as the filter
        if (product.hasOwnProperty('flavorNotes')) {
          // If it does, extract the value of that property
          const tempOptions = product['flavorNotes'].map(option => {
            return { value: option.flavorNote }
          })

          options.push(...tempOptions)
        }
        return options
      }, [])
      .filter((option, index, self) => {
        // Use the filter method to remove duplicate options
        return self.findIndex(o => o.value === option.value) === index
      })
  }

  return products
    .reduce<FilterOption[]>((options, product) => {
      // Check if the product object has a property with the same ID as the filter
      if (product.hasOwnProperty(filter.id)) {
        // If it does, extract the value of that property
        const id = filter.id as keyof Coffee

        const option = {
          value: product[id].toString(),
          name: product[id].toString()
        }

        options.push(option)
      }
      return options
    }, [])
    .filter((option, index, self) => {
      // Use the filter method to remove duplicate options
      return self.findIndex(o => o.value === option.value) === index
    })
}

export const sortFilterOptions = (options: FilterOption[]) => {
  return options.sort((a, b) => {
    if (a.value < b.value) {
      return -1
    }
    if (a.value > b.value) {
      return 1
    }
    return 0
  })
}

export const getMinFilterValue = (products: Coffee[]) => {
  return Math.min(...products.map(product => product['pricePerKilo']))
}

export const getMaxFilterValue = (products: Coffee[]) => {
  return Math.max(...products.map(product => product['pricePerKilo']))
}

export const filterProducts = (products: Coffee[], filters: SelectedFilterOptions[]) => {
  return products.filter(product => {
    return filters.every(filter => {
      if (filter.type === 'range') {
        const filterId = filter.id as keyof Coffee

        return product[filterId] >= filter.min && product[filterId] <= filter.max
      }

      if (filter.type === 'checkbox') {
        if (filter.values.length === 0) return true

        if (filter.id === 'flavorNotes') {
          return filter.values.every(filterValue =>
            product['flavorNotes'].map(flavorNote => flavorNote.flavorNote).includes(filterValue)
          )
        } else {
          const filterId = filter.id as keyof Coffee

          return filter.values.includes(product[filterId].toString())
        }
      }

      return true
    })
  })
}

export const searchProducts = (products: Coffee[], searchQuery: string) => {
  return products.filter(product => {
    return (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })
}
