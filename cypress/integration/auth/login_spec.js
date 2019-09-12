describe('Login Page', function() {
	it('sets auth cookie when logging in via form submission', function() {
		cy.visit('http://localhost:3001')
		const form = {
			phoneNumber: '7244691666',
			password: 'mamoru1'
		}
		cy.get('input[name=phoneNumber]').type(form.phoneNumber)

		// // {enter} causes the form to submit
		cy.get('input[name=password]').type(`${form.password}{enter}`)

		// // we should be redirected to /dashboard
		cy.url().should('include', '/appointments')

		// // our auth cookie should be present
		cy.getCookie('cusid-access').should('exist')
	})
})
