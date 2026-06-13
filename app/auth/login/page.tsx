import Link from "next/link"
import { Suspense } from "react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface-cream flex flex-col">
      <header className="px-page-margin-mobile md:px-page-margin-desktop pt-8">
        <Link
          href="/"
          className="font-display text-[24px] leading-[1.3] text-text-rich tracking-tight hover:text-accent-sage transition-colors"
        >
          Hortensia
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-page-margin-mobile md:px-page-margin-desktop">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl border border-border/20 p-10">
            <div className="text-center mb-10">
              <h1 className="font-display text-[32px] leading-[1.2] text-text-rich mb-3">
                Welcome back
              </h1>
              <p className="font-body text-[16px] leading-relaxed text-on-surface-variant">
                Sign in to your client portal
              </p>
            </div>

            <Suspense fallback={<div className="h-[200px] animate-pulse bg-surface-container-low rounded-lg" />}>
              <LoginForm />
            </Suspense>

            <p className="mt-8 text-center font-body text-[14px] leading-relaxed text-on-surface-variant">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-accent-sage hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
