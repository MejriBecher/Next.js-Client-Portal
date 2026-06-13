import type { Metadata } from "next";
import { Libre_Caslon_Text, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Hortensia — Premium Client Portal",
    template: "%s | Hortensia",
  },
  description:
    "The editorial standard for client relationships. A premium digital concierge that unifies communication, project management, and reporting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${libreCaslon.variable} ${hankenGrotesk.variable}`}
    >
      <body className="min-h-screen flex flex-col font-body antialiased">
        {children}
      </body>
    </html>
  );
}
