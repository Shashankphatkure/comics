import localFont from "next/font/local";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import SearchBar from "./components/SearchBar";

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
      <div className="border-2 border-[var(--color-primary)] p-2">
        <Link href="/" className="block">
          <Image
            src="/logo.png"
            alt="Social Smokers"
            width={200}
            height={40}
            className="h-auto"
          />
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <SearchBar />
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors uppercase"
          >
            HOME
          </Link>
          <Link
            href="/search"
            className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors uppercase"
          >
            BROWSE
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
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t-2 border-[var(--color-primary)] mt-8 py-6 bg-[var(--color-background)]">
      <div className="container mx-auto px-4 text-center">
        <p className="text-[var(--color-text)] text-sm">
          © {new Date().getFullYear()} Social Smokers. All rights reserved.
        </p>
        <p className="text-[var(--color-text)] text-xs mt-2">
          All characters and content are fictional. Any resemblance to real
          persons or events is purely coincidental.
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen relative">
          <div className="absolute inset-0 bg-black/50 z-0"></div>
          <div className="relative z-10">
            <Header />
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
