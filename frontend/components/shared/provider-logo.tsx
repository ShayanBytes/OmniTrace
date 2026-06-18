import { Boxes, Cloud, Cpu, Sparkles } from "lucide-react";

import type { Provider } from "@/lib/mock-data";

/**
 * Inline mark for each AI provider. Uses lucide glyphs (no external brand
 * assets) tinted to convey local vs cloud vs self-host.
 */
export function ProviderLogo({
  id,
  className = "h-5 w-5",
}: {
  id: Provider["id"];
  className?: string;
}) {
  switch (id) {
    case "ollama":
      return <Cpu className={className} />;
    case "openai":
      return <Sparkles className={className} />;
    case "anthropic":
      return <Cloud className={className} />;
    default:
      return <Boxes className={className} />;
  }
}
