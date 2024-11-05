"use client";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { tags } from "../data/tags";

function SearchContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredComics, setFilteredComics] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");

  // Initialize with all comics when component mounts
  useEffect(() => {
    const fetchComics = async () => {
      const { data, error } = await supabase
        .from("comics")
        .select("*")
        .order("release_date", { ascending: false });

      if (error) {
        console.error("Error:", error);
        return;
      }

      const comicsArray = data.map((comic) => [comic.id.toString(), comic]);
      sortComics(comicsArray, sortOrder);
      setFilteredComics(comicsArray);
    };

    fetchComics();
  }, []);

  // Filter and sort comics when search term, tags, or sort order change
  useEffect(() => {
    filterComics();
  }, [searchTerm, selectedTags, sortOrder]);

  // Update search term when URL parameter changes
  useEffect(() => {
    const queryTerm = searchParams.get("q");
    if (queryTerm) {
      setSearchTerm(queryTerm);
    }
  }, [searchParams]);

  const sortComics = (comicsArray, order) => {
    return comicsArray.sort(([, a], [, b]) => {
      const dateA = new Date(a.releaseDate);
      const dateB = new Date(b.releaseDate);
      return order === "newest" ? dateB - dateA : dateA - dateB;
    });
  };

  const filterComics = async () => {
    let query = supabase.from("comics").select("*");

    // Add search filter if there's a search term
    if (searchTerm.trim() !== "") {
      query = query.or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
      );
    }

    // Add tags filter if there are selected tags
    if (selectedTags.length > 0) {
      query = query.contains("tags", selectedTags);
    }

    // Add sorting
    query = query.order("release_date", { ascending: sortOrder === "oldest" });

    const { data, error } = await query;

    if (error) {
      console.error("Error:", error);
      return;
    }

    setFilteredComics(data.map((comic) => [comic.id.toString(), comic]));
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

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

        {/* Sort Order */}
        <div className="mb-6">
          <h2 className="text-[var(--color-text)] text-xl mb-3">Sort By:</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setSortOrder("newest")}
              className={`px-4 py-2 rounded-md border-2 transition-colors ${
                sortOrder === "newest"
                  ? "bg-[var(--color-primary)] text-[var(--color-background)] border-[var(--color-primary)]"
                  : "border-[var(--color-primary)] text-[var(--color-text)] hover:bg-[var(--color-primary)]/10"
              }`}
            >
              Newest First
            </button>
            <button
              onClick={() => setSortOrder("oldest")}
              className={`px-4 py-2 rounded-md border-2 transition-colors ${
                sortOrder === "oldest"
                  ? "bg-[var(--color-primary)] text-[var(--color-background)] border-[var(--color-primary)]"
                  : "border-[var(--color-primary)] text-[var(--color-text)] hover:bg-[var(--color-primary)]/10"
              }`}
            >
              Oldest First
            </button>
          </div>
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
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredComics.map(([id, comic]) => (
          <Link href={`/issue/${id}`} key={id}>
            <div className="retro-card group cursor-pointer h-full">
              <div className="relative aspect-square overflow-hidden">
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
                    Released: {new Date(comic.releaseDate).toLocaleDateString()}
                  </p>
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

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="retro-card p-8 text-center">
            <p className="text-[var(--color-text)] text-xl">Loading...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
