import { ScrollProgress } from "@/components/layout/scroll-progress";
import { StickyNav } from "@/components/layout/sticky-nav";
import { Footer } from "@/components/layout/footer";

/**
 * Shared shell for the marketing pages ( / , /features , /docs ): scroll
 * progress, the route-aware sticky nav, and the footer. The functional /app
 * route lives outside this group and uses its own console layout.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <StickyNav />
      {children}
      <Footer />
    </>
  );
}
