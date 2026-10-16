import { FloatingContactActions } from "@/components/layout/FloatingContactActions";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { RevealObserver } from "@/components/layout/RevealObserver";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { getMainNav, primaryCta } from "@/content/navigation";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-gold-500 px-4 py-3 font-semibold text-navy-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <UtilityBar />
      <Header nav={getMainNav()} cta={primaryCta} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      {/* Keeps the footer clear of the mobile action bar. */}
      <div aria-hidden="true" className="h-[calc(3.5rem+env(safe-area-inset-bottom))] bg-navy-900 lg:hidden" />
      <FloatingContactActions />
      <RevealObserver />
    </>
  );
}
