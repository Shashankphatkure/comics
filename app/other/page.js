export default function Other() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <main className="flex-1">
          <h2 className="retro-title text-4xl mb-8 text-center">
            Extra Content
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Merchandise Section */}
            <div className="retro-card overflow-hidden group">
              <div className="relative h-48 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[var(--color-text)]">
                    Coming Soon!
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-[var(--color-text)]">
                  Merchandise
                </h3>
                <p className="text-[var(--color-text)] mb-4">
                  Exclusive t-shirts, prints, and collectibles featuring your
                  favorite characters and moments from Social Smokers.
                </p>
                <button className="retro-button">Shop Now</button>
              </div>
            </div>

            {/* Fan Art Gallery */}
            <div className="retro-card overflow-hidden group">
              <div className="relative h-48 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[var(--color-text)]">
                    Fan Gallery
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-[var(--color-text)]">
                  Fan Art
                </h3>
                <p className="text-[var(--color-text)] mb-4">
                  Showcase your artistic talent! Submit your fan art and see it
                  featured in our community gallery.
                </p>
                <button className="retro-button">View Gallery</button>
              </div>
            </div>

            {/* Community Links */}
            <div className="retro-card p-6">
              <h3 className="text-2xl font-bold mb-4 text-[var(--color-text)]">
                Community Links
              </h3>
              <div className="grid gap-4">
                <a
                  href="#"
                  className="comic-panel p-4 hover:transform hover:-translate-y-1 transition-transform"
                >
                  <h4 className="font-bold text-[var(--color-primary)]">
                    Official Wiki
                  </h4>
                  <p className="text-[var(--color-text)]">
                    Explore the world of Social Smokers
                  </p>
                </a>
                <a
                  href="#"
                  className="comic-panel p-4 hover:transform hover:-translate-y-1 transition-transform"
                >
                  <h4 className="font-bold text-[var(--color-primary)]">
                    Fan Forum
                  </h4>
                  <p className="text-[var(--color-text)]">
                    Join the discussion
                  </p>
                </a>
                <a
                  href="#"
                  className="comic-panel p-4 hover:transform hover:-translate-y-1 transition-transform"
                >
                  <h4 className="font-bold text-[var(--color-primary)]">
                    Discord Server
                  </h4>
                  <p className="text-[var(--color-text)]">
                    Chat with fellow fans
                  </p>
                </a>
              </div>
            </div>

            {/* Updates & News */}
            <div className="retro-card p-6">
              <h3 className="text-2xl font-bold mb-4 text-[var(--color-text)]">
                Latest Updates
              </h3>
              <div className="space-y-4">
                <div className="comic-panel p-4">
                  <span className="text-sm text-[var(--color-primary)] font-bold">
                    March 15, 2024
                  </span>
                  <h4 className="font-bold text-[var(--color-text)]">
                    New Merchandise Coming Soon!
                  </h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Get ready for our spring collection...
                  </p>
                </div>
                <div className="comic-panel p-4">
                  <span className="text-sm text-[var(--color-primary)] font-bold">
                    March 1, 2024
                  </span>
                  <h4 className="font-bold text-[var(--color-text)]">
                    Fan Art Contest Winners
                  </h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Check out our February winners...
                  </p>
                </div>
                <div className="comic-panel p-4">
                  <span className="text-sm text-[var(--color-primary)] font-bold">
                    February 28, 2024
                  </span>
                  <h4 className="font-bold text-[var(--color-text)]">
                    Issue #4 Announcement
                  </h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Coming this April...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
