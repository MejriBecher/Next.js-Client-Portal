import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { SignOutButton } from "@/components/sign-out-button"
import { ThemeToggle } from "@/components/theme-toggle"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/dashboard")
  }

  return (
    <div className="min-h-screen bg-surface-cream flex flex-col">
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-light">
        <nav className="max-w-[1120px] mx-auto px-page-margin-mobile md:px-page-margin-desktop flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="font-display text-[20px] leading-[1.3] text-text-rich tracking-tight"
            >
              Hortensia
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="font-body text-[14px] leading-relaxed text-on-surface-variant hover:text-accent-sage transition-colors"
              >
                Requests
              </Link>
              <Link
                href="/dashboard/insights"
                className="font-body text-[14px] leading-relaxed text-on-surface-variant hover:text-accent-sage transition-colors"
              >
                Insights
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-body text-[14px] leading-relaxed text-on-surface-variant hover:text-accent-sage transition-colors"
            >
              Back to site
            </Link>
            <ThemeToggle />
            <SignOutButton />
          </div>
        </nav>
      </header>

      <main className="flex-1 px-page-margin-mobile md:px-page-margin-desktop py-10">
        <div className="max-w-[1120px] mx-auto">{children}</div>
      </main>
    </div>
  )
}
