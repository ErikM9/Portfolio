/* Covers the Portfolio page's cards, their layout and the links their buttons open */
describe('Portfolio page', () => {
  beforeEach(() => {
    cy.visit('/#/portfolio')
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen')
    })
  })

  it('renders the Portfolio heading', () => {
    cy.get('.portfolio-page h1 [aria-hidden="true"]').should(
      'have.text',
      'Portfolio'
    )
  })

  it('lists the ten projects in order', () => {
    cy.get('.card-title [aria-hidden="true"]').should(($titles) => {
      const titles = Cypress._.map($titles, (title) =>
        title.textContent.replace(/\u00A0/g, ' ')
      )
      expect(titles).to.deep.equal([
        'Nexus',
        'Puck',
        'Nabu',
        'floodWatch',
        'Blackjack Game',
        'Colour Picker',
        'Memory Game',
        'Currency Converter',
        'Weather Dashboard',
        'Calculator',
      ])
    })
  })

  it('lays the cards out in five columns on a desktop and one on a phone', () => {
    cy.get('.button-card-container').should(($grid) => {
      expect($grid.css('grid-template-columns').split(' ')).to.have.length(5)
    })
    cy.viewport(390, 844)
    cy.get('.button-card-container').should(($grid) => {
      expect($grid.css('grid-template-columns').split(' ')).to.have.length(1)
    })
  })

  it('hides the card buttons on a desktop while no card is hovered', () => {
    cy.get('.card-buttons').each(($buttons) => {
      cy.wrap($buttons).should('have.css', 'opacity', '0')
    })
  })

  /* The buttons only take clicks once a hover reveals them, which Cypress cannot trigger, so these clicks are forced */
  it('See on GitHub opens the repository in a new tab', () => {
    cy.contains('.button-card', 'Nexus')
      .contains('button', 'See on GitHub')
      .click({ force: true })
    cy.get('@windowOpen').should(
      'have.been.calledWith',
      'https://github.com/ErikM9/Nexus',
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('Live Version opens the live site in a new tab', () => {
    cy.contains('.button-card', 'Calculator')
      .contains('button', 'Live Version')
      .click({ force: true })
    cy.get('@windowOpen').should(
      'have.been.calledWith',
      'https://erikm9.github.io/calculator-app/',
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('hides a hovered card title letter until the pointer leaves', () => {
    const letter = (options) =>
      cy
        .contains('.button-card', 'Nexus')
        .find('.card-title [aria-hidden="true"] span')
        .first(options)
    /* The letters switch to their hover class three and a half seconds in */
    letter({ timeout: 10000 })
      .should('have.class', 'text-animate-hover')
      .and('have.css', 'opacity', '1')

    letter().hoverWithMouse()
    letter().should('have.css', 'opacity', '0')
    cy.moveMouseAway()

    letter().should('have.css', 'opacity', '1')
  })

  it("hides a card's buttons once the pointer leaves, though the clicked button keeps the focus", () => {
    cy.contains('.button-card', 'Nexus').as('card')
    /* Settled in place first, so the pointer finds the button where the card ends up */
    cy.get('@card').should('have.css', 'opacity', '1')
    cy.get('@card').hoverWithMouse()
    cy.get('@card').find('.card-buttons').should('have.css', 'opacity', '1')
    cy.get('@card').contains('button', 'See on GitHub').clickWithMouse()
    cy.get('@windowOpen').should('have.been.calledOnce')
    cy.focused().should('have.text', 'See on GitHub')

    cy.moveMouseAway()

    cy.get('@card').find('.card-buttons').should('have.css', 'opacity', '0')
  })

  it("shows a card's buttons to a keyboard user tabbing into it", () => {
    cy.contains('.button-card', 'Nexus')
      .contains('button', 'Live Version')
      .focus()

    cy.pressTab()

    cy.focused().should('have.text', 'See on GitHub')
    cy.contains('.button-card', 'Puck')
      .find('.card-buttons')
      .should('have.css', 'opacity', '1')
  })

  it('shows the card buttons without a hover on a phone', () => {
    cy.viewport(390, 844)
    cy.contains('.button-card', 'Calculator')
      .find('.card-buttons')
      .should('have.css', 'opacity', '1')
    cy.contains('.button-card', 'Calculator')
      .contains('button', 'Live Version')
      .click()
    cy.get('@windowOpen').should(
      'have.been.calledWith',
      'https://erikm9.github.io/calculator-app/',
      '_blank',
      'noopener,noreferrer'
    )
  })
})