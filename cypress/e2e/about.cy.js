/* Covers the About page's content, while navigation.cy.js covers getting there */
describe('About page', () => {
  beforeEach(() => {
    cy.visit('/#/about')
  })

  /* The headings show one span per letter, hidden from screen readers, so the letters' assembled text is checked */
  it('renders the About me heading', () => {
    cy.get('h1 [aria-hidden="true"]').should(($letters) => {
      expect($letters.text().replace(/\u00A0/g, ' ')).to.equal('About me')
    })
  })

  it('renders the Contact me heading', () => {
    cy.get('h2 [aria-hidden="true"]').should(($letters) => {
      expect($letters.text().replace(/\u00A0/g, ' ')).to.equal('Contact me')
    })
  })

  it('renders the bio with the testing tools list', () => {
    cy.get('.about-text').should('contain.text', 'ISTQB Certified Tester')
    cy.get('.about-text').should('contain.text', 'Playwright')
    cy.get('.about-text').should('contain.text', 'Cypress')
  })

  it('renders the contact details', () => {
    cy.get('.contact-text').should('contain.text', 'erikmworkm@gmail.com')
    cy.get('.contact-text').should('contain.text', 'Oxfordshire')
  })

  it('renders the spinning cube with six faces', () => {
    cy.get('.cubespinner').should('have.css', 'animation-name', 'spincube')
    cy.get('.cubespinner > div').should('have.length', 6)
  })
})