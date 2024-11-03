import localFont from "next/font/local";
import "./globals.css";
import ClientHeader from "./components/ClientHeader";

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
            <ClientHeader />
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
