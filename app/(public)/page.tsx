import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        <section className="pt-24 pb-section-gap px-page-margin-mobile md:px-page-margin-desktop bg-surface-container-low">
          <div className="max-w-[1120px] mx-auto text-center">
            <h1 className="font-display text-[48px] md:text-[64px] leading-[1.05] tracking-tight text-text-rich max-w-2xl mx-auto mb-10">
              Your clients deserve a seamless experience.
            </h1>
            <p className="font-body text-[18px] leading-relaxed text-on-surface-variant max-w-xl mx-auto mb-12">
              The editorial standard for client relationships. A premium digital
              concierge that unifies communication, project management, and
              reporting into a single, sophisticated space your clients will
              love to use.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-20">
              <Link
                href="/auth/signup"
                className="bg-accent-sage text-white px-8 py-4 rounded font-label text-[14px] leading-[1.2] tracking-[0.05em] font-semibold uppercase hover:opacity-90 transition-all"
              >
                Start free trial
              </Link>
              <Link
                href="#"
                className="border border-border text-on-surface px-8 py-4 rounded font-label text-[14px] leading-[1.2] tracking-[0.05em] font-semibold uppercase hover:bg-surface-container-low hover:border-accent-sage transition-all"
              >
                Book a demo
              </Link>
            </div>
            <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-xl shadow-lg">
              <Image
                src="/hero-mockup.png"
                alt="Premium Client Portal Interface"
                width={1120}
                height={700}
                priority
                className="w-full h-auto block"
              />
            </div>
            <div className="mt-24">
              <span className="font-label text-[12px] leading-[1.2] font-semibold uppercase text-on-surface-variant mb-4 block text-center">
                Trusted by founders at
              </span>
              <hr className="border-0 h-[1px] bg-border/30 w-full" />
              <div className="flex flex-wrap justify-between items-center opacity-40 grayscale gap-8 pt-0 mt-0">
                <span className="font-display text-[24px] leading-[1.3] text-on-surface-variant opacity-80">
                  Curve
                </span>
                <span className="font-display text-[24px] leading-[1.3] text-on-surface-variant opacity-80">
                  Thryve
                </span>
                <span className="font-display text-[24px] leading-[1.3] text-on-surface-variant opacity-80">
                  Stellify
                </span>
                <span className="font-display text-[24px] leading-[1.3] text-on-surface-variant opacity-80">
                  Aprecia
                </span>
                <span className="font-display text-[24px] leading-[1.3] text-on-surface-variant opacity-80">
                  Kian
                </span>
                <span className="font-display text-[24px] leading-[1.3] text-on-surface-variant opacity-80">
                  NexGen
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-section-gap px-page-margin-mobile md:px-page-margin-desktop bg-surface-container-low">
          <div className="max-w-[1120px] mx-auto space-y-section-gap">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div className="space-y-6">
                <h2 className="font-display text-[32px] leading-[1.2] text-text-rich">
                  Communicate with clarity.
                </h2>
                <p className="font-body text-[18px] leading-relaxed text-on-surface-variant">
                  Replace messy email threads with organized project updates
                  that keep everyone aligned. Our intelligent messaging system
                  allows clients to see exactly where milestones stand in
                  real-time. This eliminates friction and builds long-term trust
                  through absolute transparency.
                </p>
              </div>
              <div className="rounded-xl overflow-hidden border border-border/20">
                <Image
                  src="/66.png"
                  alt="Client messaging interface"
                  width={540}
                  height={420}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div className="order-2 md:order-1 rounded-xl overflow-hidden border border-border/20">
                <Image
                  src="/screen.png"
                  alt="Project timeline interface"
                  width={540}
                  height={420}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <h2 className="font-display text-[32px] leading-[1.2] text-text-rich">
                  Visualize every milestone.
                </h2>
                <p className="font-body text-[18px] leading-relaxed text-on-surface-variant">
                  Project management is transformed into a visual journey that
                  celebrates progress. Showcase your work through stunning
                  timelines that translate complex development into intuitive
                  milestones. Your clients can witness the growth of their
                  project with every interaction, fostering a sense of shared
                  accomplishment.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-page-margin-mobile md:px-page-margin-desktop bg-surface-cta">
          <div className="max-w-[1120px] mx-auto text-center py-20">
            <h2 className="font-display text-[48px] md:text-[64px] leading-[1.05] tracking-tight text-text-rich mb-8 max-w-2xl mx-auto">
              Give your clients a space they'll actually use.
            </h2>
            <Link
              href="/auth/signup"
              className="bg-accent-sage text-white px-12 py-5 rounded-lg font-label text-[14px] leading-[1.2] tracking-[0.05em] font-semibold uppercase hover:opacity-90 transition-all shadow-lg shadow-accent-sage/10 inline-block"
            >
              Get started for free
            </Link>
            <p className="mt-6 text-on-surface-variant font-label text-[12px] leading-[1.2] font-semibold">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-low border-t border-border-light">
        <div className="max-w-[1120px] mx-auto px-page-margin-desktop flex flex-col gap-gutter py-16">
          <div className="flex flex-col md:flex-row justify-between gap-20 py-20">
            <div className="space-y-8 max-w-xs">
              <h3 className="font-display text-[24px] leading-[1.3] text-text-rich tracking-tight">
                Hortensia
              </h3>
              <p className="text-on-surface-variant font-body text-[16px] leading-relaxed">
                The editorial standard for client relationships. We provide a
                premium digital concierge that unifies communication and project
                management into a single, sophisticated space.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 md:gap-24">
              <div className="flex flex-col gap-6">
                <span className="font-label text-[14px] leading-[1.2] tracking-[0.05em] font-semibold uppercase text-text-rich">
                  Product
                </span>
                <div className="flex flex-col gap-4">
                  <Link
                    href="#"
                    className="text-on-surface-variant font-body text-[16px] leading-relaxed hover:text-accent-sage transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="#"
                    className="text-on-surface-variant font-body text-[16px] leading-relaxed hover:text-accent-sage transition-colors"
                  >
                    Solutions
                  </Link>
                  <Link
                    href="#"
                    className="text-on-surface-variant font-body text-[16px] leading-relaxed hover:text-accent-sage transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="#"
                    className="text-on-surface-variant font-body text-[16px] leading-relaxed hover:text-accent-sage transition-colors"
                  >
                    Updates
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <span className="font-label text-[14px] leading-[1.2] tracking-[0.05em] font-semibold uppercase text-text-rich">
                  Company
                </span>
                <div className="flex flex-col gap-4">
                  <Link
                    href="#"
                    className="text-on-surface-variant font-body text-[16px] leading-relaxed hover:text-accent-sage transition-colors"
                  >
                    About
                  </Link>
                  <Link
                    href="#"
                    className="text-on-surface-variant font-body text-[16px] leading-relaxed hover:text-accent-sage transition-colors"
                  >
                    Careers
                  </Link>
                  <Link
                    href="#"
                    className="text-on-surface-variant font-body text-[16px] leading-relaxed hover:text-accent-sage transition-colors"
                  >
                    Contact
                  </Link>
                  <Link
                    href="#"
                    className="text-on-surface-variant font-body text-[16px] leading-relaxed hover:text-accent-sage transition-colors"
                  >
                    Press
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <span className="font-label text-[14px] leading-[1.2] tracking-[0.05em] font-semibold uppercase text-text-rich">
                  Resources
                </span>
                <div className="flex flex-col gap-4">
                  <Link
                    href="#"
                    className="text-on-surface-variant font-body text-[16px] leading-relaxed hover:text-accent-sage transition-colors"
                  >
                    Blog
                  </Link>
                  <Link
                    href="#"
                    className="text-on-surface-variant font-body text-[16px] leading-relaxed hover:text-accent-sage transition-colors"
                  >
                    Documentation
                  </Link>
                  <Link
                    href="#"
                    className="text-on-surface-variant font-body text-[16px] leading-relaxed hover:text-accent-sage transition-colors"
                  >
                    Help Center
                  </Link>
                  <Link
                    href="#"
                    className="text-on-surface-variant font-body text-[16px] leading-relaxed hover:text-accent-sage transition-colors"
                  >
                    Status
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border-light pt-8 text-center text-on-surface-variant font-body text-[14px] leading-relaxed">
            &copy; {new Date().getFullYear()} Hortensia. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
