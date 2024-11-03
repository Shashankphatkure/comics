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
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const lastDistance = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

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
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      lastDistance.current = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
    } else {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      if (lastDistance.current) {
        const delta = distance - lastDistance.current;
        setScale((prevScale) =>
          Math.min(Math.max(1, prevScale + delta * 0.01), 3)
        );
      }
      lastDistance.current = distance;
    } else {
      touchEndX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    lastDistance.current = null;
    if (!touchStartX.current || !touchEndX.current) return;

    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold && scale === 1) {
      if (diff > 0) {
        goToPage(currentPage + 1);
      } else {
        goToPage(currentPage - 1);
      }
    }

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

  // Add zoom handling for mouse wheel
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      setScale((prevScale) => Math.min(Math.max(1, prevScale + delta), 3));
    }
  }, []);

  // Reset zoom when page changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentPage]);

  // Add wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  // Add mouse event handlers
  const handleMouseDown = (e) => {
    if (scale > 1) {
      isDragging.current = true;
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging.current && scale > 1) {
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;

      // Calculate bounds to prevent dragging outside of visible area
      const container = containerRef.current;
      const bounds = {
        x: (container.clientWidth * (scale - 1)) / 2,
        y: (container.clientHeight * (scale - 1)) / 2,
      };

      setPosition({
        x: Math.min(Math.max(newX, -bounds.x), bounds.x),
        y: Math.min(Math.max(newY, -bounds.y), bounds.y),
      });
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Add useEffect for mouse event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        container.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [scale]); // Add scale as dependency

  return (
    <div
      className={`flex flex-col items-center ${
        isFullscreen
          ? "fixed inset-0 bg-[var(--color-background)] z-50 p-4"
          : "w-full"
      }`}
    >
      {/* Controls Info */}
      <div className="comic-panel p-4 mb-6 text-center w-full max-w-2xl">
        <p className="text-[var(--color-text)]">
          Use ← → arrow keys or swipe to navigate • Press F for fullscreen •
          Click image to zoom
        </p>
      </div>

      {/* Comic Display - Updated sizing */}
      <div
        ref={containerRef}
        className={`comic-panel relative mb-6 w-full overflow-hidden ${
          isZoomed || isFullscreen ? "h-[80vh]" : "h-[60vh]"
        }`}
        onClick={() => {
          if (scale === 1) {
            setIsZoomed(!isZoomed);
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Add zoom controls */}
        <div className="absolute top-2 right-2 flex gap-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setScale((prev) => Math.min(prev + 0.5, 3));
            }}
            className="w-8 h-8 rounded bg-[var(--color-paper)] text-[var(--color-text)] hover:bg-[var(--color-primary)] transition-colors flex items-center justify-center shadow-md"
            title="Zoom in"
          >
            +
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setScale((prev) => Math.max(prev - 0.5, 1));
            }}
            className="w-8 h-8 rounded bg-[var(--color-paper)] text-[var(--color-text)] hover:bg-[var(--color-primary)] transition-colors flex items-center justify-center shadow-md"
            title="Zoom out"
          >
            −
          </button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-background)]/90 z-10">
            <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${
              position.y / scale
            }px)`,
            transition: scale === 1 ? "transform 0.1s ease-out" : "none",
            transformOrigin: "center center",
            height: "100%",
            width: "100%",
            position: "relative",
            cursor: scale > 1 ? "grab" : "pointer",
          }}
        >
          {pages[currentPage] ? (
            <Image
              src={pages[currentPage]}
              alt={`Issue ${issue} - Page ${currentPage + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              className="object-contain"
              priority
              quality={100}
              onLoadingComplete={() => setIsLoading(false)}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <span className="text-[var(--color-text)]">Page not found</span>
            </div>
          )}
        </div>
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
            className="bg-transparent outline-none text-[var(--color-text)]"
          >
            {pages.map((_, index) => (
              <option
                key={index}
                value={index}
                className="bg-[var(--color-paper)]"
              >
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
        <span className="text-[var(--color-text)] font-bold">
          Page {currentPage + 1} of {pages.length}
        </span>
      </div>
    </div>
  );
}
