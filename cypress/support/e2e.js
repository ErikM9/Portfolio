/* Ignores uncaught errors from GSAP, so only the app's own errors fail a spec */
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('gsap') || err.message.includes('GSAP')) {
    return false
  }
})

/* An element's middle on the runner's page, where the DevTools protocol measures from, through the app's scaled frame */
const pointOf = (element) => {
  element.scrollIntoView({ block: 'center' })
  /* Cypress's own handle on the app's frame, as the app window's frameElement reads null from the spec */
  const frame = Cypress.$autIframe[0]
  const frameBox = frame.getBoundingClientRect()
  const scale = frameBox.width / frame.offsetWidth
  const box = element.getBoundingClientRect()
  return {
    x: frameBox.x + (box.x + box.width / 2) * scale,
    y: frameBox.y + (box.y + box.height / 2) * scale,
  }
}

/* Sends input through the browser's DevTools protocol, so :hover and :focus-visible follow it as they follow a person's */
const devtools = (command, params) =>
  Cypress.automation('remote:debugger:protocol', { command, params })

const mouse = (type, { x, y }) =>
  devtools('Input.dispatchMouseEvent', {
    type,
    x,
    y,
    pointerType: 'mouse',
    ...(type === 'mouseMoved'
      ? { button: 'none' }
      : { button: 'left', buttons: 1, clickCount: 1 }),
  })

Cypress.Commands.add(
  'hoverWithMouse',
  { prevSubject: 'element' },
  (subject) => {
    cy.then(() => mouse('mouseMoved', pointOf(subject[0])))
    return cy.wrap(subject, { log: false })
  }
)

Cypress.Commands.add(
  'clickWithMouse',
  { prevSubject: 'element' },
  (subject) => {
    const point = pointOf(subject[0])
    cy.then(() => mouse('mouseMoved', point))
    cy.then(() => mouse('mousePressed', point))
    cy.then(() => mouse('mouseReleased', point))
    return cy.wrap(subject, { log: false })
  }
)

/* Rests the pointer in the top corner of the runner's page, clear of every card */
Cypress.Commands.add('moveMouseAway', () =>
  cy.then(() => mouse('mouseMoved', { x: 1, y: 1 }))
)

/* Tab has no text, so its press goes as the raw key down the protocol expects of such keys */
Cypress.Commands.add('pressTab', () => {
  const tab = { key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }
  cy.then(() =>
    devtools('Input.dispatchKeyEvent', { type: 'rawKeyDown', ...tab })
  )
  cy.then(() => devtools('Input.dispatchKeyEvent', { type: 'keyUp', ...tab }))
})