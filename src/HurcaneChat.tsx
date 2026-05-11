import React, { CSSProperties } from "react";

export interface HurcaneChatProps {
  /** Agent ID or slug */
  agentId: string;
  theme?: "light" | "dark";
  /** Host override — defaults to https://hurcane.com */
  host?: string;
  style?: CSSProperties;
  className?: string;
  /** iframe title for accessibility */
  title?: string;
}

/**
 * Renders the Hurcane agent chat inline inside your page.
 *
 * ```tsx
 * <HurcaneChat agentId="my-agent" style={{ height: 600 }} />
 * ```
 */
export function HurcaneChat({
  agentId,
  theme = "light",
  host = "https://hurcane.com",
  style,
  className,
  title = "Hurcane AI Agent",
}: HurcaneChatProps) {
  const src = `${host}/chat/${agentId}?embedded=true&theme=${theme}`;

  return (
    <iframe
      src={src}
      title={title}
      allow="clipboard-write"
      className={className}
      style={{
        border: "none",
        borderRadius: 14,
        width: "100%",
        height: 500,
        display: "block",
        ...style,
      }}
    />
  );
}
