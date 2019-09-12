describe('User Home Screen', function() {
	it('creates an account and logs in', function() {
		cy.login('5961426663', '596-142-6663')
		cy.url()

        cy.get('[data-cy="checkin-btn"]').click()
        cy.contains("Lorenzo's")
        cy.get('.overflow a:first-of-type div').click()
		cy.url().should('include', 'lorenzo')

        cy.get('[data-cy="employee-list"]').should('exist')
	})
})
