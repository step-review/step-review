- Design-system components are presentation and basic-interaction primitives.
  Use Mantine components; wrappers must stay free of application business logic.
- Prefer Mantine components and their props. Use custom styles where its APIs do
  not cover the requirement, using Mantine CSS variables where applicable; do
  not override Mantine internals.
- Colocate custom styles in CSS Modules named after their owning component.
  Components style their own elements; arrange children through public APIs or
  surrounding containers, without selectors reaching into child components.
- Reserve global CSS for the Mantine stylesheet and font imports and document
  defaults. Configure the theme in `createAppTheme` and
  `appCssVariablesResolver`, after GitHub's Primer design system.
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
