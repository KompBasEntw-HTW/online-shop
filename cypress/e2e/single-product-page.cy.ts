import { Coffee } from '../../types'

describe('single product page', () => {
  before(() => {
    cy.request('GET', '/api/product-service/coffee/35')
      .its('body')
      .then((data: Coffee) => {
        cy.wrap(data).as('testData')
      })
  })

  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.visit('localhost/products/35')

    cy.get('.product-size-list').as('productSizeList')
    cy.get('button').contains('Add to cart').as('addToCartButton')
  })

  it('can render product data correctly', () => {
    cy.get('h1').should('have.text', '71 House Blend')
    cy.get('#product-description').should(
      'have.text',
      "This signature House Blend was crafted as the hallmark coffee for Irving's original cafe at 71 Irving Place. Classic, rich, smooth flavors are great with milk."
    )
    cy.get('#total-price').should('have.text', '$4.90 USD*')
    cy.get('@productSizeList')
      .find('.product-size-option')
      .first()
      .should('have.attr', 'aria-checked', 'true')
  })

  it('can choose product sizes and quantities', () => {
    cy.get('@productSizeList')
      .find('.product-size-option')
      .first()
      .should('have.attr', 'aria-checked', 'true')

    cy.get('@productSizeList')
      .find('.product-size-option')
      .last()
      .click()
      .should('have.attr', 'aria-checked', 'true')

    cy.get('#quantity').as('quantity').should('have.value', '1')
    cy.get('#total-price').should('have.text', '$15.70 USD*')

    cy.get('@quantity').clear().type('2')
    cy.get('#total-price').should('have.text', '$31.40 USD*')

    cy.get('@productSizeList').find('.product-size-option').eq(1).click()
    cy.get('#total-price').should('have.text', '$8.80 USD*')
    cy.get('@quantity').clear().type('5')
    cy.get('#total-price').should('have.text', '$44.20 USD*')

    cy.get('@quantity').clear().type('0')
    cy.get('#total-price').should('have.text', '$44.20 USD*')
    cy.get('@addToCartButton').should('be.disabled')
    cy.get('#product-configurator-error').should('have.text', 'Quantity must be between 1 and 7')
  })

  it.only('can add product to cart', () => {
    cy.get('@addToCartButton').click()
    cy.get('#header-cart-count').should('have.text', '1')
    cy.get('#toast').should('be.visible')

    cy.get('#header-cart-button').click()
    cy.get('.header-cart-item')
      .should('have.length', 1)
      .and('be.visible')
      .find('h3')
      .should('have.text', '71 House Blend')
  })
})

export {}
