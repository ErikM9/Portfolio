/* On a phone the sidebar collapses into a menu which the hamburger opens and the close button shuts */
describe('Mobile navigation', () => {
  beforeEach(() => {
    cy.viewport(390, 844) /* Matches an iPhone 14 screen */
    cy.visit('/')
  })

  it('hamburger icon is visible on mobile', () => {
    cy.get('button[aria-label="Open menu"]').should('be.visible')
  })

  it('nav is hidden by default on mobile', () => {
    cy.get('nav').should('not.be.visible')
  })

  it('tapping hamburger opens the nav', () => {
    cy.get('button[aria-label="Open menu"]').click()
    cy.get('nav').should('be.visible')
  })

  it('tapping close icon hides the nav', () => {
    cy.get('button[aria-label="Open menu"]').click()
    cy.get('button[aria-label="Close menu"]').click()
    cy.get('nav').should('not.be.visible')
  })

  it('pressing Escape closes the nav and puts focus back on the menu button', () => {
    cy.get('button[aria-label="Open menu"]').click()
    cy.focused().should('have.attr', 'aria-label', 'Close menu')
    cy.get('body').type('{esc}')
    cy.get('nav').should('not.be.visible')
    cy.focused().should('have.attr', 'aria-label', 'Open menu')
  })

  it('tapping a nav link closes the nav', () => {
    cy.get('button[aria-label="Open menu"]').click()
    cy.get('nav a[aria-label="About"]').click()
    cy.get('nav').should('not.be.visible')
    cy.url().should('include', '/#/about')
  })
})