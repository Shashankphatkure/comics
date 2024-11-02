"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

export default function ComicViewer({ issue, pages }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Preload images
  useEffect(() => {
    const preloadImages = () => {
      // Preload current, next and previous pages
      const pagesToPreload = [
        pages[currentPage - 1],
        pages[currentPage],
        pages[currentPage + 1],
      ].filter(Boolean);

      pagesToPreload.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
      });
    };

    preloadImages();
  }, [currentPage, pages]);

  const goToPage = useCallback(
    (pageNum) => {
      if (pageNum >= 0 && pageNum < pages.length) {
        setIsLoading(true);
        setCurrentPage(pageNum);
      }
    },
    [pages.length]
  );

  // Touch navigation
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // minimum distance for swipe

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left
        goToPage(currentPage + 1);
      } else {
        // Swipe right
        goToPage(currentPage - 1);
      }
    }

    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") {
        goToPage(currentPage - 1);
      } else if (e.key === "ArrowRight") {
        goToPage(currentPage + 1);
      } else if (e.key === "f") {
        toggleFullscreen();
      } else if (e.key === "Escape") {
        setIsFullscreen(false);
        setIsZoomed(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, goToPage]);

  // Fullscreen handling
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center ${
        isFullscreen
          ? "fixed inset-0 bg-[var(--color-background)] z-50 p-4"
          : ""
      }`}
    >
      {/* Controls Info */}
      <div className="comic-panel p-4 mb-6 text-center w-full max-w-2xl">
        <p className="text-[var(--color-secondary)]">
          Use ← → arrow keys or swipe to navigate • Press F for fullscreen •
          Click image to zoom
        </p>
      </div>

      {/* Comic Display */}
      <div
        className={`comic-panel relative mb-6
        ${
          isZoomed || isFullscreen
            ? "w-full h-[80vh]"
            : "aspect-square max-w-3xl"
        }`}
        onClick={() => setIsZoomed(!isZoomed)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
            <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {pages[currentPage] ? (
          <Image
            src={pages[currentPage]}
            alt={`Issue ${issue} - Page ${currentPage + 1}`}
            fill
            className="object-contain"
            priority
            quality={100}
            onLoadingComplete={() => setIsLoading(false)}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="text-[var(--color-secondary)]">
              Page not found
            </span>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
          className="retro-button"
        >
          ← Previous
        </button>

        <div className="retro-select">
          <select
            value={currentPage}
            onChange={(e) => goToPage(Number(e.target.value))}
            className="bg-transparent outline-none"
          >
            {pages.map((_, index) => (
              <option key={index} value={index}>
                Page {index + 1}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === pages.length - 1}
          className="retro-button"
        >
          Next →
        </button>

        <button onClick={toggleFullscreen} className="retro-button">
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </div>

      {/* Page Counter */}
      <div className="comic-panel px-4 py-2">
        <span className="font-bold">
          Page {currentPage + 1} of {pages.length}
        </span>
      </div>
    </div>
  );
}
