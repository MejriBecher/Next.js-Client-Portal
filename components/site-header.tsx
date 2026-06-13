import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md transition-all duration-300">
      <nav className="max-w-[1120px] mx-auto px-page-margin-mobile md:px-page-margin-desktop flex items-center justify-between h-20">
        <div className="flex items-center gap-gutter">
          <Link
            href="/"
            className="font-display text-[24px] leading-[1.3] text-text-rich tracking-tight"
          >
            Hortensia
          </Link>
          <div className="hidden md:flex items-center gap-gutter">
            <Link
              href="#"
              className="text-on-surface-variant hover:text-accent-sage transition-colors duration-300 font-label text-[14px] leading-[1.2] tracking-[0.05em] font-semibold"
            >
              Product
            </Link>
            <Link
              href="#"
              className="text-on-surface-variant hover:text-accent-sage transition-colors duration-300 font-label text-[14px] leading-[1.2] tracking-[0.05em] font-semibold"
            >
              Solutions
            </Link>
            <Link
              href="#"
              className="text-on-surface-variant hover:text-accent-sage transition-colors duration-300 font-label text-[14px] leading-[1.2] tracking-[0.05em] font-semibold"
            >
              Pricing
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-gutter">
          <ThemeToggle />
          <Link
            href="/auth/login"
            className="hidden sm:block text-on-surface hover:text-accent-sage transition-all font-label text-[14px] leading-[1.2] tracking-[0.05em] font-semibold hover:underline"
          >
            Member Access
          </Link>
          <Link
            href="/auth/signup"
            className="bg-accent-sage text-white px-6 py-3 rounded hover:opacity-90 transition-all active:scale-95 font-label text-[14px] leading-[1.2] tracking-[0.05em] font-semibold"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
