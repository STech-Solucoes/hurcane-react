import React, { useEffect, useRef, useState } from "react";

export interface HurcaneWidgetProps {
  /** Agent ID or slug */
  agentId: string;
  theme?: "light" | "dark";
  position?: "bottom-right" | "bottom-left";
  /** Accent color for the button (ignored when bubble icon is set) */
  color?: string;
  /** Host override — defaults to https://hurcane.com */
  host?: string;
  /** Supabase functions base URL — override only if self-hosting. */
  apiUrl?: string;
}

const ICON_CHAT = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: "none" }}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10h8" />
    <path d="M8 14h5" />
  </svg>
);

const ICON_CLOSE = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: "none" }}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * Renders a floating chat button that opens the Hurcane agent in a popup.
 * Drop it anywhere in your React app (e.g. inside `<App />`).
 *
 * ```tsx
 * <HurcaneWidget agentId="my-agent" apiUrl="https://xyz.supabase.co/functions/v1" />
 * ```
 */
export function HurcaneWidget({
  agentId,
  theme = "light",
  position = "bottom-right",
  color = "#1400FF",
  host = "https://hurcane.com",
  apiUrl = "https://xbjohkpkocruilyxbeix.supabase.co/functions/v1",
}: HurcaneWidgetProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const cacheKey = `hurcane_bubble_${agentId}`;
  const [bubbleIcon, setBubbleIcon] = useState<string | null>(() => {
    try { return localStorage.getItem(cacheKey) || null; } catch { return null; }
  });

  const isRight = position === "bottom-right";
  const side = isRight ? { right: 20 } : { left: 20 };

  // Fast fetch from agent-meta edge function
  useEffect(() => {
    if (!apiUrl) return;
    fetch(`${apiUrl}/agent-meta?id=${agentId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        const icon = data?.bubble_icon_url || null;
        try {
          if (icon) localStorage.setItem(cacheKey, icon);
          else localStorage.removeItem(cacheKey);
        } catch {}
        setBubbleIcon(icon);
      })
      .catch(() => {});
  }, [agentId, apiUrl, cacheKey]);

  // Listen for messages from the iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== host) return;
      if (e.data?.type === "HURCANE_WIDGET_RESIZE" && containerRef.current) {
        containerRef.current.style.height = `${e.data.height}px`;
      }
      if (e.data?.type === "HURCANE_WIDGET_AGENT_INFO") {
        const icon = e.data.bubbleIconUrl || null;
        try {
          if (icon) localStorage.setItem(cacheKey, icon);
          else localStorage.removeItem(cacheKey);
        } catch {}
        setBubbleIcon(icon);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [host, cacheKey]);

  const src = `${host}/chat/${agentId}?embedded=true&theme=${theme}`;

  const isCustomIcon = bubbleIcon && !open;
  const btnStyle: React.CSSProperties = {
    position: "fixed",
    bottom: 20,
    ...side,
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: open ? "#4b5563" : isCustomIcon ? "transparent" : color,
    color: "#fff",
    border: "none",
    cursor: "pointer",
    boxShadow: open
      ? "0 4px 20px rgba(0,0,0,0.25)"
      : isCustomIcon
      ? "0 4px 20px rgba(0,0,0,0.2)"
      : `0 4px 20px ${color}55`,
    zIndex: 999999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: isCustomIcon ? 0 : undefined,
    overflow: isCustomIcon ? "hidden" : undefined,
    transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
  };

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 999997 }}
        />
      )}

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

      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        style={btnStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.cursor = "pointer";
          e.currentTarget.style.boxShadow = open
            ? "0 6px 28px rgba(0,0,0,0.35)"
            : bubbleIcon
            ? "0 6px 24px rgba(0,0,0,0.28)"
            : `0 6px 24px ${color}70`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.cursor = "pointer";
          e.currentTarget.style.boxShadow = open
            ? "0 4px 20px rgba(0,0,0,0.25)"
            : bubbleIcon
            ? "0 4px 20px rgba(0,0,0,0.2)"
            : `0 4px 20px ${color}55`;
        }}
      >
        {bubbleIcon && !open ? (
          <img
            src={bubbleIcon}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block", pointerEvents: "none" }}
          />
        ) : open ? ICON_CLOSE : ICON_CHAT}
      </button>
    </>
  );
}
