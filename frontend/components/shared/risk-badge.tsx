import { Badge } from "@/components/ui/badge";
import { riskLevel } from "@/lib/risk";
import type { GraveyardFile } from "@/lib/mock-data";

/** Risk pill derived from a file's idle-days × complexity score. */
export function RiskBadge({ file }: { file: GraveyardFile }) {
  const risk = riskLevel(file);
  return (
    <Badge variant={risk.badge}>
      <span className={`h-1.5 w-1.5 rounded-full ${risk.dot}`} />
      {risk.label}
    </Badge>
  );
}
