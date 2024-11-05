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
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const element = containerRef.current.parentElement;
        await element.requestFullscreen();
        setIsFullscreen(true);
        // Reset zoom and position when entering fullscreen
        setScale(1);
        setPosition({ x: 0, y: 0 });
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        // Reset zoom and position when exiting fullscreen
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  // Add fullscreen change event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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

  // Update the mouse event handlers
  const handleMouseDown = (e) => {
    // Only initiate drag if left mouse button is clicked and image is zoomed
    if (e.button === 0 && scale > 1) {
      e.preventDefault(); // Prevent image dragging default behavior
      isDragging.current = true;
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      // Change cursor to grabbing while dragging
      e.target.style.cursor = "grabbing";
    }
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging.current && scale > 1) {
        e.preventDefault();
        const newX = e.clientX - dragStart.current.x;
        const newY = e.clientY - dragStart.current.y;

        // Calculate maximum allowed movement based on zoom level
        const container = containerRef.current;
        const bounds = {
          x: (container.clientWidth * (scale - 1)) / 2,
          y: (container.clientHeight * (scale - 1)) / 2,
        };

        // Apply bounds with smoother movement
        setPosition({
          x: Math.max(-bounds.x, Math.min(bounds.x, newX)),
          y: Math.max(-bounds.y, Math.min(bounds.y, newY)),
        });
      }
    },
    [scale]
  );

  const handleMouseUp = useCallback(
    (e) => {
      if (isDragging.current) {
        e.preventDefault();
        isDragging.current = false;
        // Reset cursor
        if (containerRef.current) {
          containerRef.current.style.cursor = scale > 1 ? "grab" : "pointer";
        }
      }
    },
    [scale]
  );

  // Update the mouse events useEffect
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      // Also handle case when mouse leaves the window
      document.addEventListener("mouseleave", handleMouseUp);

      return () => {
        container.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mouseleave", handleMouseUp);
      };
    }
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`comic-viewer-container ${
        isFullscreen ? "fixed inset-0 bg-black z-50" : "relative w-full"
      }`}
    >
      {/* Main viewer container */}
      <div
        className={`flex flex-col items-center ${
          isFullscreen ? "h-screen p-4" : "w-full"
        }`}
      >
        {/* Controls Info */}
        <div className="comic-panel p-4 mb-4 text-center w-full max-w-2xl">
          <p className="text-[var(--color-text)]">
            Use ← → arrow keys or swipe to navigate • Press F for fullscreen •
            Click image to zoom
          </p>
        </div>

        {/* Comic Display */}
        <div
          ref={containerRef}
          className={`comic-panel relative w-full ${
            isFullscreen ? "h-[85vh]" : "h-[60vh]"
          } flex items-center justify-center overflow-hidden`}
          style={{
            maxWidth: isFullscreen ? "95vw" : "100%",
            margin: "0 auto",
          }}
        >
          {/* Image Container */}
          <div
            className="relative w-full h-full"
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${
                position.y / scale
              }px)`,
              transition: isDragging.current
                ? "none"
                : "transform 0.1s ease-out",
              transformOrigin: "center center",
              cursor:
                scale > 1
                  ? isDragging.current
                    ? "grabbing"
                    : "grab"
                  : "pointer",
            }}
            onClick={(e) => {
              if (scale === 1 && !isDragging.current) {
                setIsZoomed(!isZoomed);
              }
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {pages[currentPage] ? (
              <Image
                src={pages[currentPage]}
                alt={`Issue ${issue} - Page ${currentPage + 1}`}
                fill
                sizes={
                  isFullscreen ? "100vw" : "(max-width: 1200px) 80vw, 70vw"
                }
                className="object-contain"
                priority
                quality={100}
                onLoadingComplete={() => setIsLoading(false)}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-[var(--color-text)]">Page not found</span>
              </div>
            )}
          </div>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-background)]/90 z-10">
              <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-20">
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
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mt-4">
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
        <div className="comic-panel px-4 py-2 mt-4">
          <span className="text-[var(--color-text)] font-bold">
            Page {currentPage + 1} of {pages.length}
          </span>
        </div>
      </div>
    </div>
  );
}
