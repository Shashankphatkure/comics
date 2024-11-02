export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <main className="flex-1">
          <h2 className="retro-title text-4xl mb-8 text-center">About Us</h2>

          <div className="grid gap-8 max-w-4xl mx-auto">
            {/* About Comic Section */}
            <div className="retro-card p-8">
              <h3 className="text-2xl font-bold mb-4 text-[var(--color-text)]">
                About Social Smokers
              </h3>
              <div className="text-[var(--color-text)]">
                <p className="mb-4">
                  Social Smokers is a groundbreaking webcomic that explores the
                  intersections of society, culture, and human connections
                  through a unique lens. Set in a world that mirrors our own,
                  each issue delves deep into compelling narratives that
                  challenge perspectives and spark conversations.
                </p>
                <p>
                  Started in 2024, our comic has grown from a small passion
                  project into a vibrant storytelling platform that reaches
                  readers worldwide.
                </p>
              </div>
            </div>

            {/* Creator Section */}
            <div className="retro-card p-8">
              <h3 className="text-2xl font-bold mb-4 text-[var(--color-text)]">
                Meet the Creator
              </h3>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="comic-panel w-48 h-48 shrink-0">
                  {/* Add creator image here */}
                  <div className="w-full h-full flex items-center justify-center bg-[var(--color-primary)]">
                    <span className="text-[var(--color-text)]">
                      Creator Photo
                    </span>
                  </div>
                </div>
                <div className="text-[var(--color-text)]">
                  <p className="mb-4">
                    Our creative team brings together years of experience in
                    storytelling, illustration, and digital artistry. With a
                    passion for creating meaningful narratives, we strive to
                    push the boundaries of what webcomics can achieve.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="retro-card p-8">
              <h3 className="text-2xl font-bold mb-4 text-[var(--color-text)]">
                Get in Touch
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <a
                  href="mailto:contact@socialsmokers.com"
                  className="comic-panel p-4 hover:transform hover:-translate-y-1 transition-transform"
                >
                  <h4 className="font-bold text-[var(--color-primary)]">
                    Email
                  </h4>
                  <p className="text-[var(--color-text)]">
                    contact@socialsmokers.com
                  </p>
                </a>
                <a
                  href="https://twitter.com/socialsmokers"
                  className="comic-panel p-4 hover:transform hover:-translate-y-1 transition-transform"
                >
                  <h4 className="font-bold text-[var(--color-primary)]">
                    Twitter
                  </h4>
                  <p className="text-[var(--color-text)]">@socialsmokers</p>
                </a>
                <a
                  href="https://instagram.com/socialsmokers"
                  className="comic-panel p-4 hover:transform hover:-translate-y-1 transition-transform"
                >
                  <h4 className="font-bold text-[var(--color-primary)]">
                    Instagram
                  </h4>
                  <p className="text-[var(--color-text)]">@socialsmokers</p>
                </a>
                <a
                  href="https://discord.gg/socialsmokers"
                  className="comic-panel p-4 hover:transform hover:-translate-y-1 transition-transform"
                >
                  <h4 className="font-bold text-[var(--color-primary)]">
                    Discord
                  </h4>
                  <p className="text-[var(--color-text)]">Join our community</p>
                </a>
              </div>
            </div>
          </div>
        </main>

        <aside className="w-full md:w-80">
          <div className="sticky top-4 space-y-6">
            <div className="retro-card p-6">
              <h3 className="retro-title text-xl mb-4">Release Schedule</h3>
              <div className="space-y-2 text-[var(--color-text)]">
                <p className="font-bold">New Issues:</p>
                <p>Every First Monday</p>
                <p className="font-bold">Updates:</p>
                <p>Weekly on Fridays</p>
              </div>
            </div>

            <div className="retro-card p-6">
              <h3 className="retro-title text-xl mb-4">Support Us</h3>
              <a href="/support" className="retro-button block text-center">
                Become a Patron
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
