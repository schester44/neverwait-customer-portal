import faker from 'faker'

describe('Register Page', function() {
	it('creates an account and logs in', function() {
		cy.visit('http://localhost:3001')

		const phoneNumber = faker.phone.phoneNumberFormat()

		const form = {
			phoneNumber,
			password: phoneNumber,
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName()
		}

		cy.get('.create-account-btn').click()

		cy.get('input[name=firstName]').type(form.firstName)
		cy.get('input[name=lastName]').type(form.lastName)
		cy.get('input[name=phoneNumber]').type(form.phoneNumber)
		cy.get('input[name=password]').type(form.password)
		cy.get('input[name=confirmPassword]').type(form.password)

		cy.get('.submit-btn').click()

		// // we should be redirected to /dashboard
		cy.url().should('include', '/appointments')

		// // our auth cookie should be present
		cy.getCookie('cusid-access').should('exist')
	})
})
