# Test Coverage Analysis

## Current State

**Test coverage: 0%** — There are no tests, no test framework, and no `package.json` in this project.

The codebase is a single-page static website (`index.html`) with embedded CSS and vanilla JavaScript. There are three distinct JavaScript behaviors that represent testable logic:

1. **Mobile navigation toggle** (lines 634–639)
2. **Live hours counter** (lines 642–653)
3. **Scroll fade-in animations** (lines 656–666)

---

## Proposed Testing Improvements

### Priority 1: Unit Tests for the Hours Counter Logic

**Why:** This is the most logic-heavy code in the site. It calculates the number of hours lived from a hardcoded birth date and formats the result. A bug here would display incorrect information prominently on the page.

**What to test:**
- The hour calculation produces the correct value for known dates (e.g., exactly 24 hours after birth should yield `24`)
- The `toLocaleString` formatting outputs comma-separated numbers (e.g., `403,800` not `403800`)
- Edge cases: the counter handles dates before the birth date gracefully (negative/zero case)

**Recommended approach:** Extract the calculation into a standalone function, then test it with a lightweight runner like [Vitest](https://vitest.dev/) or even inline `<script>` assertions during development.

### Priority 2: DOM Integration Tests for Mobile Navigation

**Why:** The mobile nav toggle controls visibility of the site's primary navigation. If it breaks on mobile, users cannot navigate the site.

**What to test:**
- Clicking the hamburger button adds the `open` class to `#nav-links`
- Clicking it again removes the `open` class
- Clicking any nav link removes the `open` class (closes the menu)

**Recommended approach:** Use a DOM testing tool like [Playwright](https://playwright.dev/) or [Cypress](https://www.cypress.io/) for end-to-end testing, or [jsdom](https://github.com/jsdom/jsdom) with Vitest for lighter-weight DOM tests.

### Priority 3: Scroll Fade-In Animation

**Why:** Lower risk — if this breaks, content is still visible (just without the fade effect). Still worth a basic smoke test.

**What to test:**
- Elements with `.fade-in` start without the `visible` class
- After intersection, the `visible` class is added
- Once visible, the observer stops watching that element (`unobserve` is called)

**Recommended approach:** Mock `IntersectionObserver` in a jsdom environment.

### Priority 4: Visual Regression & Cross-Browser Testing

**Why:** The site relies heavily on CSS (`clamp()`, CSS Grid, CSS custom properties, `scroll-behavior: smooth`). These could render differently across browsers.

**What to test:**
- Responsive layout at key breakpoints: 480px, 700px, 800px, 1100px+
- Navigation layout switches from horizontal to hamburger menu at 700px
- Stats grid reflows correctly at 800px and 480px breakpoints

**Recommended approach:** Playwright with screenshot comparison, or a service like Percy/Chromatic.

### Priority 5: Accessibility & HTML Validation

**Why:** Ensures the site is usable by all visitors and follows web standards.

**What to test:**
- All interactive elements are keyboard-accessible
- The hamburger button has an appropriate `aria-label` (it does: `"Open menu"`) and ideally toggles `aria-expanded`
- Color contrast ratios meet WCAG AA (gold on forest-green, cream on black)
- Valid HTML (no broken nesting, correct heading hierarchy)

**Recommended approach:** [axe-core](https://github.com/dequelabs/axe-core) via Playwright, or the [pa11y](https://pa11y.org/) CLI tool. HTML validation via the [W3C validator](https://validator.w3.org/).

---

## Recommended Setup

To introduce testing with minimal overhead for this project:

```bash
npm init -y
npm install -D vitest jsdom playwright @axe-core/playwright
```

**Suggested file structure:**
```
├── index.html
├── package.json
├── tests/
│   ├── hours-counter.test.js    # Unit tests for counter logic
│   ├── navigation.test.js       # DOM tests for mobile nav
│   ├── fade-in.test.js          # DOM tests for scroll animations
│   ├── accessibility.test.js    # axe-core accessibility audit
│   └── visual.test.js           # Playwright screenshot tests
```

## Summary Table

| Area | Risk if Broken | Current Coverage | Effort to Add |
|------|---------------|-----------------|---------------|
| Hours counter logic | High (wrong data displayed) | None | Low |
| Mobile navigation | High (site unusable on mobile) | None | Low |
| Scroll animations | Low (content still visible) | None | Low |
| Visual/responsive layout | Medium (layout breaks) | None | Medium |
| Accessibility | Medium (excludes users) | None | Low–Medium |
