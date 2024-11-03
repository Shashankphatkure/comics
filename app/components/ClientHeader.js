"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";

export default function ClientHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-2 border-[var(--color-primary)] p-4 bg-[var(--color-background)] sticky top-0 z-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Logo and hamburger section */}
        <div className="flex items-center justify-between">
          <div className="border-2 border-[var(--color-primary)] p-2">
            <Link href="/" className="block">
              <Image
                src="/logo.png"
                alt="Social Smokers"
                width={200}
                height={40}
                className="h-auto w-[150px] md:w-[200px]"
              />
            </Link>
          </div>

          {/* Hamburger Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="space-y-2">
              <span
                className={`block w-8 h-0.5 bg-[var(--color-text)] transition-transform duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-2.5" : ""
                }`}
              ></span>
              <span
                className={`block w-8 h-0.5 bg-[var(--color-text)] transition-opacity duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-8 h-0.5 bg-[var(--color-text)] transition-transform duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-2.5" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Navigation and Search Section */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-center gap-6`}
        >
          <SearchBar />
          <nav className="flex flex-col md:flex-row items-center gap-6">
            <Link
              href="/"
              className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors uppercase w-full md:w-auto text-center py-2 md:py-0"
            >
              HOME
            </Link>
            <Link
              href="/search"
              className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors uppercase w-full md:w-auto text-center py-2 md:py-0"
            >
              BROWSE
            </Link>
            <Link
              href="/about"
              className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors uppercase w-full md:w-auto text-center py-2 md:py-0"
            >
              ABOUT
            </Link>
            <Link
              href="/other"
              className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors uppercase w-full md:w-auto text-center py-2 md:py-0"
            >
              OTHER
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
