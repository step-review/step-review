- Design-system components are presentation and basic-interaction primitives.
  Use Primer React components; wrappers must stay free of application business
  logic. Build what Primer lacks in the design system.
- Prefer Primer components and their props, and Octicons for icons. Use custom
  styles where its APIs do not cover the requirement, using Primer's design
  tokens (`@primer/primitives` CSS variables) instead of raw values; do not
  override Primer internals.
- Colocate custom styles in CSS Modules named after their owning component.
  Components style their own elements; arrange children through public APIs or
  surrounding containers, without selectors reaching into child components.
- Reserve global CSS for the design token and font imports and document
  defaults.
- Extract recurring visual patterns into design-system components with their own
  CSS Modules.
- Widgets have one identifiable responsibility, compose primitives and other
  widgets, and may use business-logic hooks.
- Routes represent pages or major navigable sections and orchestrate their
  layout and widgets.
- Root only selects route components; each route owns its layout and
  composition.
- Model navigation routes as discriminated objects with a `name` field and
  route-specific parameters, and centralize their URL conversion.
- Keep logic that interprets a review (diff layout, fingerprints, steps) in
  `src/business-logic/`, as plain functions with unit tests. Components only
  render its results.
- Translate user-visible text with `react-intl` and keep the catalogs up to date
  (`translations:extract`, `translations:compile`).
