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
    <header className="border-2 border-[var(--color-primary)] p-4 flex justify-between items-center bg-[var(--color-paper)]">
      <div className="border-2 border-[var(--color-primary)] p-2">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-[var(--color-primary)] text-2xl font-bold">
            SOCIAL SMOKERS
          </h1>
        </Link>
      </div>
      <nav className="text-[var(--color-text)]">
        <Link
          href="/"
          className="hover:text-[var(--color-primary)] transition-colors"
        >
          HOME
        </Link>
        <span className="mx-2 text-[var(--color-primary)]">|</span>
        <Link
          href="/about"
          className="hover:text-[var(--color-primary)] transition-colors"
        >
          ABOUT
        </Link>
        <span className="mx-2 text-[var(--color-primary)]">|</span>
        <Link
          href="/other"
          className="hover:text-[var(--color-primary)] transition-colors"
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
