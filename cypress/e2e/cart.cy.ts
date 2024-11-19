describe('cart page', () => {
	beforeEach(() => {
		cy.viewport(1280, 720)
	})

	it('can render empty cart correctly', () => {
		cy.visit('localhost/cart')
		cy.get('h1').should('have.text', 'Shopping Cart')
		cy.get('h2').first().should('have.text', 'Your cart is empty')
	})

	it.only('can render cart items correctly, update quantities and remove items from cart', () => {
		cy.visit('localhost/products/35')
		cy.get('.product-size-list').find('.product-size-option').last().click()
		cy.get('#quantity').clear().type('5')
		cy.get('button').contains('Add to cart').click()
		cy.visit('localhost/products/20')
		cy.get('.product-size-list').find('.product-size-option').last().click()
		cy.get('#quantity').clear().type('1')
		cy.get('button').contains('Add to cart').click()
		cy.visit('localhost/cart')
		cy.get('h1').should('have.text', 'Shopping Cart')
		cy.get('#subtotal').should('have.text', '$95.00')
		cy.get('#tax-estimate').should('have.text', '$19.00')
		cy.get('#shipping-cost-estimate').should('have.text', '$5.00')
		cy.get('#order-total').should('have.text', '$119.00')
		cy.get('p').contains("You're almost there").should('exist')

		cy.get('.cart-item').should('have.length', 2)
		cy.get('.cart-item').first().find('h3').should('have.text', '71 House Blend')
		cy.get('.cart-item').first().find('select').should('have.value', '5')
		cy.get('.cart-item').last().find('select').should('have.value', '1')

		cy.get('.cart-item').last().find('select').select('3')
		cy.get('#subtotal').should('have.text', '$127.80')
		cy.get('#tax-estimate').should('have.text', '$24.30')
		cy.get('#shipping-cost-estimate').should('have.text', '$0.00')
		cy.get('#order-total').should('have.text', '$152.10')
		cy.get('p').contains("You're eligible for free standard shipping").should('exist')

		cy.get('.cart-item').last().find('button').click() // remove item
		cy.get('.cart-item').should('have.length', 1)
		cy.get('.cart-item').first().find('h3').should('have.text', '71 House Blend')
		cy.get('#subtotal').should('have.text', '$78.60')
		cy.get('#tax-estimate').should('have.text', '$15.90')
		cy.get('#shipping-cost-estimate').should('have.text', '$5.00')
		cy.get('#order-total').should('have.text', '$99.50')
		cy.get('p').contains("You're almost there").should('exist')

		cy.get('#checkout-button').click()
		cy.url().should('include', '/checkout')
	})
})
export {}
