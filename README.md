# Erik Moldovan | Portfolio

![CI](https://github.com/ErikM9/Portfolio/actions/workflows/ci.yml/badge.svg)

My portfolio site, built with React 18. It introduces me, gives my contact details and shows ten of my projects, with links to their repositories and live versions.

**Live site:** [erikm9.github.io/Portfolio](https://erikm9.github.io/Portfolio/)

## Pages

- **Home**: a greeting which animates in letter by letter, with a spinning gear and my logo fading in beside it on a desktop and a cube of technology icons below it on a phone
- **About**: a short bio and my contact details, with the cube beside them on a desktop
- **Portfolio**: ten project cards, five to a row on a desktop and one to a row on a phone. A card's See on GitHub and Live Version buttons appear when it is hovered or tabbed into, and stay visible on touch screens and narrow windows.

The layout keeps its proportions on every screen. `Layout` zooms the page to fit a reference layout, 1807x800 on a desktop and 390x844 on a phone, and fits portrait tablets to the content instead.

The site also works with a keyboard and a screen reader. The animated headings read as whole words, the decorative code tags stay silent, every card button names its project, and the mobile menu takes the focus, keeps Tab inside it and closes on Escape.

## Run it

```bash
npm install
npm start
```

Then open http://localhost:3000.

## Tech stack

| Layer | Tech |
| --- | --- |
| Framework | React 18 (Create React App) |
| Routing | React Router 6, with `HashRouter` so links to a page and reloads work on GitHub Pages |
| Animations | animate.css, GSAP |
| Styling | SCSS, loaders.css |
| Fonts | Self-hosted Inter, JetBrains Mono and La Belle Aurore |
| Icons | Font Awesome |
| Unit tests | Jest, React Testing Library, user-event |
| E2E tests | Cypress |

## Testing

I used Jest and React Testing Library for the unit tests and Cypress for the end-to-end tests.

```bash
npm test                 # unit tests in watch mode
npm run test:coverage    # unit tests once, with coverage (fails below 90%)
npm run lint             # ESLint over the code and both test suites
npm run test:e2e         # e2e tests (run npm start in another terminal first)
npm run cypress:open     # e2e tests in the interactive Cypress runner
```

### Why these tools?

- Jest is already set up by Create React App, so the tests compile with the same Babel config as the site. Its fake timers skip straight to the moment the letters switch to their hover animation, and its coverage fails the run below 90%.
- React Testing Library and user-event find elements by their role and text wherever the markup allows, and click them the way a visitor would, so most tests check what a visitor sees instead of the components' internals. jsdom also lets a test set the window size and fire `resize`, which is how the zoom in `Layout` is tested at desktop, phone and tablet sizes.
- Cypress runs the site in a real browser, which the parts that depend on CSS need: whether the mobile menu shows, whether a card's buttons stay hidden on a desktop and show on a phone, how many columns the cards form and whether the tag decorators are visible. `cy.viewport` switches between desktop and phone sizes within a test, and `cy.stub` catches the new tabs the cards open. CSS `:hover` and `:focus-visible` don't follow the events Cypress fires itself, so the commands in `cypress/support/e2e.js` move the pointer and press Tab through Chrome's DevTools protocol, as a real mouse and keyboard would.

### What's tested

**Unit (86 tests, 99% of statements)**

| Area | Tests |
| --- | --- |
| App routing, including unknown addresses | 4 |
| Layout: the zoom at desktop, phone and tablet sizes and in short windows, the landmarks and the silent tag decorators | 20 |
| Sidebar: page links, profile links, the mobile menu with its keyboard handling, and the active page | 14 |
| Home | 9 |
| Logo | 6 |
| About | 10 |
| Portfolio: the card order and the links the cards open | 17 |
| AnimatedLetters | 6 |

**End-to-end (33 tests)**

| Spec | Tests |
| --- | --- |
| Navigation: the sidebar, the calls to action, the return links, reloads, unknown addresses and the tag decorators | 12 |
| About page | 5 |
| Portfolio page: the card order, the grid's columns, the title letters under the pointer, when the buttons show and the tabs they open | 10 |
| Mobile navigation, Escape and focus included | 6 |

## CI

GitHub Actions runs ESLint, the unit tests with coverage and the production build on every push and pull request to `main`, and then runs the Cypress suite in Chrome against that build. A push to `main` which passes them all is deployed to GitHub Pages, using the same build.

## Project structure

```
public/
  index.html              HTML shell with the title, description and manifest links
  manifest.json           web app manifest: name, theme colour and icons
  favicon.ico, logo*.png  icons made from the E.M. logo
src/
  index.js                entry point, with createRoot and HashRouter
  App.js                  routes
  App.scss                fonts, animate.css and the loader
  index.css               page background and base styles
  assets/
    fonts/                self-hosted fonts, with the licences of Inter, JetBrains Mono and La Belle Aurore
    images/               the logo
  components/
    AnimatedLetters/      letter-by-letter text animation
    Home/                 landing page
      Logo/               gear and logo with staggered fade-ins
    About/                bio and contact details beside the TechCube
    TechCube/             spinning 3D CSS cube with technology icons
    Portfolio/            project cards with hover-reveal buttons
    Layout/               sidebar, tag decorators and the zoom to fit the screen
    Sidebar/              page links, profile links and the mobile menu
  __tests__/              Jest unit tests
  __mocks__/              fileMock.js, which stands in for images and stylesheets
cypress/
  e2e/                    navigation, About, Portfolio and mobile menu specs
  support/e2e.js          ignores uncaught errors from GSAP, and moves the pointer and presses Tab as a person would
```

## Contact

- **Email:** erikmworkm@gmail.com
- **LinkedIn:** [linkedin.com/in/erik-moldovan-399754305](https://www.linkedin.com/in/erik-moldovan-399754305/)
- **GitHub:** [github.com/ErikM9](https://github.com/ErikM9)