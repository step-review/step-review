import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vitest";
import componentNamedProps from "./componentNamedProps.js";

// Setup SUT
RuleTester.describe = describe;
RuleTester.it = it;
const ruleTester = new RuleTester({
  languageOptions: { parserOptions: { lang: "tsx" } },
});

// Exercise and verify
ruleTester.run("component-named-props", componentNamedProps, {
  valid: [
    {
      name: "allows a component with a props interface",
      code: "interface Props { label: string } function Button({ label }: Props) { return <button>{label}</button>; }",
    },
    {
      name: "allows a component with a named union of props",
      code: 'type Props = { kind: "link"; href: string } | { kind: "button"; onClick: () => void }; function Action(props: Props) { return <span />; }',
    },
    {
      name: "allows a component with an imported props type",
      code: 'import type { ButtonProps } from "./types"; const Button = (props: ButtonProps) => <button />;',
    },
    {
      name: "allows a generic component with named props",
      code: "interface Props<T> { item: T } function Item<T>(props: Props<T>) { return <div />; }",
    },
    {
      name: "allows a component without props",
      code: "function Button() { return <button />; }",
    },
    {
      name: "allows inline parameters in a lowercase helper that returns JSX",
      code: "function renderButton({ label }: { label: string }) { return <button>{label}</button>; }",
    },
    {
      name: "allows inline event parameters inside a component",
      code: "function Button() { return <button onClick={(event: { value: string }) => event.value} />; }",
    },
    {
      name: "allows a component with a default value and named props",
      code: "interface Props { label?: string } function Button({ label }: Props = {}) { return <button>{label}</button>; }",
    },
    {
      name: "allows a component typed with a named React function component type",
      code: 'import type { FC } from "react"; interface Props { label: string } const Button: FC<Props> = ({ label }) => <button>{label}</button>;',
    },
    {
      name: "allows a component typed through a React namespace import",
      code: 'import * as React from "react"; interface Props { label: string } const Button: React.FunctionComponent<Props> = ({ label }) => <button>{label}</button>;',
    },
    {
      name: "allows a memoized component with a named props argument",
      code: 'import { memo as memoize } from "react"; interface Props { label: string } const Button = memoize<Props>(({ label }) => <button>{label}</button>);',
    },
    {
      name: "allows a component forwarding a ref with named props",
      code: 'import React from "react"; interface Props { label: string } const Button = React.forwardRef<HTMLButtonElement, Props>(({ label }, ref) => <button ref={ref}>{label}</button>);',
    },
    {
      name: "allows a memoized component with a named parameter type",
      code: 'import { memo } from "react"; interface Props { label: string } const Button = memo(({ label }: Props) => <button>{label}</button>);',
    },
    {
      name: "allows a component with a parenthesized named props type",
      code: "interface Props { label: string } function Button(props: (Props)) { return <button />; }",
    },
    {
      name: "allows a component checked against a React function component type",
      code: 'import type { FC } from "react"; interface Props { label: string } const Button = (({ label }) => <button>{label}</button>) satisfies FC<Props>;',
    },
    {
      name: "allows an anonymous default component with named props",
      filename: "Button.tsx",
      code: "interface Props { label: string } export default ({ label }: Props) => <button>{label}</button>;",
    },
    {
      name: "ignores unrelated wrapper callbacks",
      code: 'import { memo } from "other-library"; const Result = memo((value: { label: string }) => value.label);',
    },
  ],
  invalid: [
    {
      name: "reports inline props on an anonymous default component",
      filename: "Button.tsx",
      code: "export default function ({ label }: { label: string }) { return <button>{label}</button>; }",
      errors: [{ messageId: "named" }],
    },
    {
      name: "reports inline props on a component with a lowercase internal name",
      code: "const Button = function renderButton({ label }: { label: string }) { return <button>{label}</button>; };",
      errors: [{ messageId: "named" }],
    },
    {
      name: "reports inline props on a function declaration",
      code: "export default function Button({ label }: { label: string }) { return <button>{label}</button>; }",
      errors: [{ messageId: "named" }],
    },
    {
      name: "reports inline props on an arrow component",
      code: "const Button = ({ label }: { label: string }) => <button>{label}</button>;",
      errors: [{ messageId: "named" }],
    },
    {
      name: "reports inline props on a function expression",
      code: "const Button = function ({ label }: { label: string }) { return <button>{label}</button>; };",
      errors: [{ messageId: "named" }],
    },
    {
      name: "reports inline union props",
      code: 'function Action(props: { kind: "link"; href: string } | { kind: "button"; onClick: () => void }) { return <span />; }',
      errors: [{ messageId: "named" }],
    },
    {
      name: "reports unnamed indexed access props",
      code: 'function Button(props: Components["button"]) { return <button />; }',
      errors: [{ messageId: "named" }],
    },
    {
      name: "reports props without a type annotation",
      code: "function Button({ label }) { return <button>{label}</button>; }",
      errors: [{ messageId: "named" }],
    },
    {
      name: "reports inline props on a component that renders nothing",
      code: "function Observer({ value }: { value: string }) { return null; }",
      errors: [{ messageId: "named" }],
    },
    {
      name: "reports inline props with a default value",
      code: "function Button({ label }: { label?: string } = {}) { return <button>{label}</button>; }",
      errors: [{ messageId: "named" }],
    },
    {
      name: "reports inline props in a React function component annotation",
      code: 'import type { FC } from "react"; const Button: FC<{ label: string }> = ({ label }) => <button>{label}</button>;',
      errors: [{ messageId: "named" }],
    },
    {
      name: "reports inline props in a memo type argument",
      code: 'import { memo } from "react"; const Button = memo<{ label: string }>(({ label }) => <button>{label}</button>);',
      errors: [{ messageId: "named" }],
    },
    {
      name: "reports inline props in a forwardRef type argument",
      code: 'import { forwardRef } from "react"; const Button = forwardRef<HTMLButtonElement, { label: string }>(({ label }, ref) => <button ref={ref}>{label}</button>);',
      errors: [{ messageId: "named" }],
    },
    {
      name: "reports inline parameter props inside nested React wrappers",
      code: 'import { memo, forwardRef } from "react"; const Button = memo(forwardRef(({ label }: { label: string }, ref) => <button ref={ref}>{label}</button>));',
      errors: [{ messageId: "named" }],
    },
  ],
});
