import React, { useEffect, useRef, useState } from "react";

export interface HurcaneWidgetProps {
  /** Agent ID or slug */
  agentId: string;
  theme?: "light" | "dark";
  position?: "bottom-right" | "bottom-left";
  /** Accent color for the button */
  color?: string;
  /** Host override — defaults to https://hurcane.com */
  host?: string;
}

const ICON_CHAT = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10h8" />
    <path d="M8 14h5" />
  </svg>
);

const ICON_CLOSE = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * Renders a floating chat button that opens the Hurcane agent in a popup.
 * Drop it anywhere in your React app (e.g. inside `<App />`).
 *
 * ```tsx
 * <HurcaneWidget agentId="my-agent" />
 * ```
 */
export function HurcaneWidget({
  agentId,
  theme = "light",
  position = "bottom-right",
  color = "#1400FF",
  host = "https://hurcane.com",
}: HurcaneWidgetProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isRight = position === "bottom-right";
  const side = isRight ? { right: 20 } : { left: 20 };

  // Listen for resize messages from the iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== host) return;
      if (e.data?.type === "HURCANE_WIDGET_RESIZE" && containerRef.current) {
        containerRef.current.style.height = `${e.data.height}px`;
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [host]);

  const src = `${host}/chat/${agentId}?embedded=true&theme=${theme}`;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 999997,
          }}
        />
      )}

      {/* Chat popup */}
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          bottom: 88,
          ...side,
          width: "min(94vw, 400px)",
          height: 600,
          maxHeight: "85vh",
          borderRadius: 14,
          boxShadow: "0 8px 48px rgba(0,0,0,0.18)",
          zIndex: 999998,
          overflow: "hidden",
          display: open ? "block" : "none",
        }}
      >
        <iframe
          src={src}
          title="Hurcane AI Agent"
          allow="clipboard-write"
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        />
      </div>

      {/* Floating button */}
      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          bottom: 20,
          ...side,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: color,
          color: "#fff",
          border: "none",
          cursor: "pointer",
          boxShadow: `0 4px 20px ${color}55`,
          zIndex: 999999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        {open ? ICON_CLOSE : ICON_CHAT}
      </button>
    </>
  );
}
