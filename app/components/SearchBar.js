"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { comics } from "../data/comics";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchResults = Object.entries(comics).filter(([id, comic]) => {
      const searchValue = value.toLowerCase();
      return (
        comic.title.toLowerCase().includes(searchValue) ||
        comic.description.toLowerCase().includes(searchValue) ||
        comic.tags.some((tag) => tag.toLowerCase().includes(searchValue))
      );
    });

    setResults(searchResults);
    setIsOpen(true);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="search"
          placeholder="Search comics..."
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 rounded-md bg-[var(--color-background)] border-2 border-[var(--color-primary)] text-[var(--color-text)] placeholder-[var(--color-text)]/50 focus:outline-none focus:border-[var(--color-accent)] w-[200px]"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-[var(--color-text)]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-[300px] bg-[var(--color-background)] border-2 border-[var(--color-primary)] rounded-md shadow-lg z-50">
          {results.map(([id, comic]) => (
            <Link
              key={id}
              href={`/issue/${id}`}
              onClick={() => {
                setIsOpen(false);
                setSearchTerm("");
              }}
            >
              <div className="p-3 hover:bg-[var(--color-primary)]/10 cursor-pointer border-b border-[var(--color-primary)]/20 last:border-b-0">
                <div className="font-bold text-[var(--color-text)]">
                  {comic.title}
                </div>
                <div className="text-sm text-[var(--color-text)]/70">
                  {comic.description.substring(0, 60)}...
                </div>
                <div className="text-xs text-[var(--color-primary)] mt-1">
                  {comic.tags.join(", ")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
