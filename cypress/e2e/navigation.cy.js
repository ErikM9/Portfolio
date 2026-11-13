/* Covers moving between the pages through the sidebar, the calls to action and the return links, and unknown addresses */
describe('Navigation', () => {
  beforeEach(() => {
    /* At the 1807px reference width the app zoom resolves to 1, so Cypress clicks at unscaled positions */
    cy.viewport(1807, 1000)
    /* HashRouter does not write "#/" on a bare "/" load, so the hash root is visited explicitly */
    cy.visit('/#/')
  })

  it('loads the home page', () => {
    cy.url().should('eq', Cypress.config().baseUrl + '/#/')
    cy.get('.home-page').should('exist')
  })

  it('sets a descriptive document title', () => {
    cy.title().should('eq', 'Erik Moldovan | Portfolio')
  })

  it('navigates to the About page via the sidebar', () => {
    cy.get('a[aria-label="About"]').click()
    cy.url().should('include', '/#/about')
    cy.get('.about-page').should('exist')
  })

  it('navigates to the Portfolio page via the sidebar', () => {
    cy.get('a[aria-label="Projects"]').click()
    cy.url().should('include', '/#/portfolio')
    cy.get('.portfolio-page').should('exist')
  })

  it('navigates back to the home page via the sidebar', () => {
    cy.get('a[aria-label="About"]').click()
    cy.get('a[aria-label="Home"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/#/')
    cy.get('.home-page').should('exist')
  })

  it('the get in touch CTA navigates to About', () => {
    cy.contains('a', /let's get in touch/i).click()
    cy.url().should('include', '/#/about')
  })

  it('the projects CTA navigates to Portfolio', () => {
    cy.contains('a', /check out my projects/i).click()
    cy.url().should('include', '/#/portfolio')
  })

  it('the return to homepage link leads home from About', () => {
    cy.get('a[aria-label="About"]').click()
    cy.contains('a', /return to homepage/i).click()
    cy.url().should('eq', Cypress.config().baseUrl + '/#/')
    cy.get('.home-page').should('exist')
  })

  it('the return to homepage link leads home from Portfolio', () => {
    cy.get('a[aria-label="Projects"]').click()
    cy.contains('a', /return to homepage/i).click()
    cy.url().should('eq', Cypress.config().baseUrl + '/#/')
    cy.get('.home-page').should('exist')
  })

  it('stays on the same page after a reload', () => {
    cy.get('a[aria-label="About"]').click()
    cy.url().should('include', '/#/about')
    cy.reload()
    cy.url().should('include', '/#/about')
    cy.get('.about-page').should('exist')
  })

  it('shows the html and body tag decorators on every page', () => {
    const decoratorsShow = () => {
      cy.get('.top-tag-html').should('be.visible').and('have.text', '<html>')
      cy.get('.top-tags').should('be.visible').and('have.text', '<body>')
      cy.get('.bottom-tags')
        .should('be.visible')
        .and('contain', '</body>')
        .and('contain', '</html>')
    }

    decoratorsShow()
    cy.get('a[aria-label="About"]').click()
    cy.url().should('include', '/#/about')
    decoratorsShow()
    cy.get('a[aria-label="Projects"]').click()
    cy.url().should('include', '/#/portfolio')
    decoratorsShow()
  })
})

describe('Unknown addresses', () => {
  it('sends an unknown address to the home page', () => {
    cy.visit('/#/projects')
    cy.url().should('eq', Cypress.config().baseUrl + '/#/')
    cy.get('.home-page').should('exist')
  })
})