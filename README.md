# hurcane-react

React components for embedding [Hurcane](https://hurcane.com) AI agents into your application.

## Installation

```bash
npm install hurcane-react
# or
yarn add hurcane-react
# or
pnpm add hurcane-react
```

## Components

### `<HurcaneWidget />`

A floating chat button that opens your agent in a popup — the easiest way to add an AI agent to any page.

```tsx
import { HurcaneWidget } from "hurcane-react";

export default function App() {
  return (
    <>
      {/* your app */}
      <HurcaneWidget agentId="your-agent-id" />
    </>
  );
}
```

#### Props

| Prop       | Type                              | Default                 | Description                             |
| ---------- | --------------------------------- | ----------------------- | --------------------------------------- |
| `agentId`  | `string`                          | —                       | **Required.** Your agent's ID or slug   |
| `theme`    | `"light" \| "dark"`               | `"light"`               | Chat color theme                        |
| `position` | `"bottom-right" \| "bottom-left"` | `"bottom-right"`        | Position of the floating button         |
| `color`    | `string`                          | `"#1400FF"`             | Accent color for the button             |
| `host`     | `string`                          | `"https://hurcane.com"` | Host override (useful for self-hosting) |

---

### `<HurcaneChat />`

Renders the agent chat inline inside your page — useful for dedicated support pages, dashboards, or sidebars.

```tsx
import { HurcaneChat } from "hurcane-react";

export default function SupportPage() {
  return (
    <HurcaneChat
      agentId="your-agent-id"
      style={{ height: 600, borderRadius: 12 }}
    />
  );
}
```

#### Props

| Prop        | Type                | Default                 | Description                           |
| ----------- | ------------------- | ----------------------- | ------------------------------------- |
| `agentId`   | `string`            | —                       | **Required.** Your agent's ID or slug |
| `theme`     | `"light" \| "dark"` | `"light"`               | Chat color theme                      |
| `style`     | `CSSProperties`     | —                       | Styles applied to the iframe          |
| `className` | `string`            | —                       | CSS class applied to the iframe       |
| `title`     | `string`            | `"Hurcane AI Agent"`    | iframe `title` for accessibility      |
| `host`      | `string`            | `"https://hurcane.com"` | Host override                         |

---

## Examples

### Dark theme widget on the left

```tsx
<HurcaneWidget
  agentId="my-agent"
  theme="dark"
  position="bottom-left"
  color="#6366f1"
/>
```

### Inline chat with fixed height

```tsx
<HurcaneChat
  agentId="my-agent"
  theme="dark"
  style={{ height: 500, borderRadius: 16 }}
/>
```

### Next.js (App Router)

Add `"use client"` since the components use browser APIs:

```tsx
"use client";
import { HurcaneWidget } from "hurcane-react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <HurcaneWidget agentId="my-agent" />
      </body>
    </html>
  );
}
```

---

## Finding your Agent ID

1. Open [hurcane.com](https://hurcane.com) and go to your agent
2. The agent ID or slug is in the URL: `hurcane.com/chat/your-agent-id`

---

## Requirements

- React 17 or later
- The agent must have its visibility set to **Public** on Hurcane

---

## License

MIT © [Hurcane](https://hurcane.com)
