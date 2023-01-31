const MAX_PRODUCT_COUNT = 30

describe('shop page', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.visit('localhost')
  })

  it('can render product data correctly', () => {
    cy.get('#product-gallery li').should('have.length', MAX_PRODUCT_COUNT)

    cy.get('#product-gallery li').first().find('h3').should('have.text', '71 House Blend')

    cy.get('#product-gallery li')
      .first()
      .find('#product-description')
      .should(
        'have.text',
        "This signature House Blend was crafted as the hallmark coffee for Irving's original cafe at 71 Irving Place. Classic, rich, smooth flavors are great with milk."
      )

    cy.get('#product-gallery li').first().find('#product-price').should('have.text', '$19,65 USD')

    cy.get('#product-gallery li')
      .first()
      .find('#product-image')
      .should(
        'have.attr',
        'src',
        '/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Froastcollective%2Fimage%2Fupload%2Fh_1000%2Cw_1000%2Cf_auto%2Cfl_progressive%3Asteep%2Cq_auto%3Agood%2Fv1661179176%2Fsolidus%2Fnien9l92dj3bis3vbvof.png&w=640&q=75'
      )

    cy.get('#product-gallery li').each($el => {
      cy.wrap($el).find('h3').should('not.be.empty')
      cy.wrap($el).find('#product-description').should('not.be.empty')
      cy.wrap($el).find('#product-price').should('not.be.empty')
      cy.wrap($el).find('#product-image').should('have.attr', 'src')
    })
  })

  it('can render filters correctly', () => {
    cy.get('#filter-form').should('exist')

    cy.get('#filter-form')
      .find('legend')
      .each($el => {
        cy.wrap($el).should('not.be.empty')
      })
  })

  it('can filter products through search queries', () => {
    // Search for "house blend"
    cy.get('#product-search').type('house blend')

    cy.get('#clear-filters-button').should('exist')

    // Assert that the number of products is is less than MAX_PRODUCT_COUNT
    const productList = cy.get('#product-gallery li')

    productList.should('have.length.lessThan', MAX_PRODUCT_COUNT)
    productList.each($el =>
      cy
        .wrap($el)
        .find('#product-title, #product-description')
        .then($el => {
          expect($el.text().toLowerCase()).to.contain('house blend')
        })
    )
  })

  it('can show no available products when no products match the search query', () => {
    cy.get('#product-search').type('test123')

    cy.get('#product-gallery li').should('have.length', 0)
    cy.get('#clear-filters-button').should('exist')
    cy.get('#empty-state-placeholder').should('exist')
  })

  it('can sort products correctly', () => {
    const productList = cy.get('#product-gallery li')
    const sortingDropdown = cy.get('#sorting-dropdown')
    const sortingDropdownButton = cy.get('#sorting-dropdown-button')

    sortingDropdown.should('exist')
    sortingDropdownButton.should('be.visible').and('have.text', 'Name (Alphabetical)')

    // Sort by name descending
    sortingDropdownButton.click()
    const sortingOptions = cy.get('#sorting-dropdown-items button')
    sortingOptions.should('have.length', 4)
    sortingOptions.first().should('have.text', 'Name (Alphabetical)')
    // click on the second option
    cy.get('#sorting-dropdown-items button').eq(1).click()

    const clearFiltersButton = cy.get('#clear-filters-button')
    clearFiltersButton.should('exist')
    productList.first().find('#product-title').should('have.text', 'Washington Blend')

    // // Sort by price descending
    sortingDropdownButton.click()
    sortingDropdownButton.should('be.visible').and('have.text', 'Name (Reverse Alphabetical)')

    cy.get('#sorting-dropdown-items button').eq(2).click()

    cy.get('#product-gallery li').first().find('#product-title').should('have.text', 'Canopy')

    // // Sort by price ascending
    sortingDropdownButton.click()
    sortingDropdownButton.should('be.visible').and('have.text', 'Price (Descending)')

    cy.get('#sorting-dropdown-items button').eq(3).click()

    cy.get('#product-gallery li').first().find('#product-title').should('have.text', 'Space Cadet')

    clearFiltersButton.click()
    cy.get('#product-gallery li')
      .first()
      .find('#product-title')
      .should('have.text', '71 House Blend')
  })

  it('can use facet filters', () => {
    cy.get('.checkbox-filter').first().find('input').first().check()

    cy.get('#product-gallery li').first().find('#product-title').should('have.text', 'City Blend')
    cy.get('#product-gallery li').should('have.length.lessThan', MAX_PRODUCT_COUNT)

    cy.get('.checkbox-filter').first().find('input').first().uncheck()

    cy.get('#product-gallery li').should('have.length', MAX_PRODUCT_COUNT)
    cy.get('#product-gallery li')
      .first()
      .find('#product-title')
      .should('have.text', '71 House Blend')

    cy.get('.checkbox-filter').each($el => {
      cy.wrap($el).find('input').first().check()
    })

    cy.get('#product-gallery li').should('have.length', 0)
    cy.get('#empty-state-placeholder').should('exist')
    cy.get('#clear-filters-button').should('exist')

    cy.get('#clear-filters-button').click()
    cy.get('#product-gallery li').should('have.length', MAX_PRODUCT_COUNT)
  })

  it('can use all available filtering options simultaneously', () => {
    cy.get('.checkbox-filter')
      .find('legend')
      .contains('Roast level')
      .parent()
      .find('input[value="7"]')
      .click()

    cy.get('#product-gallery li').should('have.length.lessThan', MAX_PRODUCT_COUNT)
    cy.get('#product-gallery li')
      .first()
      .find('#product-title')
      .should('have.text', 'Black Bear Blend')

    cy.get('.checkbox-filter')
      .contains('Flavor')
      .parents('#checkbox-filter-container')
      .find('button')
      .click()

    cy.get('.checkbox-filter')
      .contains('Flavor')
      .parent()
      .find('input[value="Sweet & Smooth"]')
      .click()

    cy.get('#product-gallery li').each($el => {
      cy.wrap($el).contains('Sweet & Smooth')
    })

    cy.get('#product-gallery li').should('have.length', 4)

    cy.get('#product-search').type('la')

    cy.get('#product-gallery li').should('have.length', 3)
    cy.get('#product-gallery li')
      .first()
      .find('#product-title')
      .should('have.text', 'Flatlander Signature Blend')

    const sortingDropdownButton = cy.get('#sorting-dropdown-button')

    sortingDropdownButton.should('be.visible').and('have.text', 'Name (Alphabetical)')

    // Sort by name descending
    sortingDropdownButton.click()
    const sortingOptions = cy.get('#sorting-dropdown-items button')
    sortingOptions.should('have.length', 4)
    sortingOptions.first().should('have.text', 'Name (Alphabetical)')
    // click on the second option
    cy.get('#sorting-dropdown-items button').eq(1).click()

    cy.get('#product-gallery li')
      .first()
      .find('#product-title')
      .should('have.text', 'Organic Toketee')

    cy.get('#clear-filters-button').click()

    cy.get('#product-gallery li').should('have.length', MAX_PRODUCT_COUNT)
    cy.get('#product-gallery li')
      .first()
      .find('#product-title')
      .should('have.text', '71 House Blend')
  })

  it('can have clickable links to product pages ', () => {
    cy.get('#product-gallery a').first().click()

    cy.url().should('include', '/products/35')
  })
})

export {}
