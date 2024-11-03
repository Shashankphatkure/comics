"use client";
import { useState, useEffect } from "react";
import { comics, tags } from "../data/comics";
import Link from "next/link";
import Image from "next/image";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredComics, setFilteredComics] = useState([]);

  // Initialize with all comics when component mounts
  useEffect(() => {
    setFilteredComics(Object.entries(comics));
  }, []);

  // Filter comics when search term or tags change
  useEffect(() => {
    filterComics();
  }, [searchTerm, selectedTags]);

  const filterComics = () => {
    const results = Object.entries(comics).filter(([id, comic]) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        comic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comic.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => comic.tags.includes(tag));

      return matchesSearch && matchesTags;
    });

    setFilteredComics(results);
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Add console.log to debug
  console.log("Current filtered comics:", filteredComics);
  console.log("Available comics:", comics);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="retro-card p-8 mb-8">
        <h1 className="retro-title text-4xl mb-6">Search Comics</h1>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="search"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[var(--color-background)] border-2 border-[var(--color-primary)] text-[var(--color-text)] placeholder-[var(--color-text)]/50 focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        {/* Tags Filter */}
        <div className="mb-6">
          <h2 className="text-[var(--color-text)] text-xl mb-3">
            Filter by Tags:
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full border-2 transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-[var(--color-primary)] text-[var(--color-background)] border-[var(--color-primary)]"
                    : "border-[var(--color-primary)] text-[var(--color-text)] hover:bg-[var(--color-primary)]/10"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-[var(--color-text)] mb-6">
          Found {filteredComics.length} comics
        </div>
      </div>

      {/* Search Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComics.map(([id, comic]) => (
          <Link href={`/issue/${id}`} key={id}>
            <div className="retro-card group cursor-pointer h-full">
              <div className="relative aspect-[2/3] overflow-hidden">
                <Image
                  src={comic.thumbnail || "/placeholder-comic.jpg"}
                  alt={comic.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-xl mb-1">
                    {comic.title}
                  </h3>
                  <p className="text-white/80 text-sm mb-2">
                    {comic.description.substring(0, 100)}...
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {comic.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-[var(--color-primary)]/80 rounded-full text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredComics.length === 0 && (
        <div className="retro-card p-8 text-center">
          <p className="text-[var(--color-text)] text-xl">
            No comics found matching your search criteria
          </p>
        </div>
      )}
    </div>
  );
}
