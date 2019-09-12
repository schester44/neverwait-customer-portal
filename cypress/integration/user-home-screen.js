describe('User Home Screen', function() {
	it('navigates via the footer to a location', function() {
		cy.login('5961426663', '596-142-6663')
		cy.url()

		cy.get('[data-cy="checkin-btn"]').click()
		cy.contains("Lorenzo's")
		cy.get('.overflow a:first-of-type div').click()
		cy.url().should('include', 'lorenzo')

		cy.get('[data-cy="employee-list"]').should('exist')
	})

	it('paginates between upcoming and past appointments', function() {
		cy.login('5961426663', '596-142-6663')
		cy.url()

		cy.get('[data-cy="user-nav-upcoming"]').click()
		cy.contains('upcoming appointments')

		cy.get('[data-cy="user-nav-past"]').click()
		cy.contains('past appointments')

		cy.get('[data-cy="user-nav-upcoming"]').click()
		cy.contains('upcoming appointments')
	})
})
