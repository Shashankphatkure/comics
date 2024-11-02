import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Social Smokers",
  description: "A retro-styled comic website",
};

function Header() {
  return (
    <header className="border-2 border-[var(--color-primary)] p-4 flex justify-between items-center bg-[var(--color-background)] sticky top-0 z-50">
      <div className="border-2 border-[var(--color-primary)] p-2 hover:bg-[var(--color-primary)] transition-colors group">
        <Link href="/" className="block">
          <h1 className="text-[var(--color-primary)] text-2xl font-bold group-hover:text-[var(--color-text)]">
            SOCIAL SMOKERS
          </h1>
        </Link>
      </div>
      <nav className="flex items-center gap-6">
        <Link
          href="/"
          className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors uppercase"
        >
          HOME
        </Link>
        <Link
          href="/about"
          className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors uppercase"
        >
          ABOUT
        </Link>
        <Link
          href="/other"
          className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors uppercase"
        >
          OTHER
        </Link>
      </nav>
    </header>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-[var(--color-background)]">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
