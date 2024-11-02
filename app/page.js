import { comics } from "./data/comics";
import BannerAd from "./components/BannerAd";
import Image from "next/image";
import Link from "next/link";
import FeaturedPanel from "./components/FeaturedPanel";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="retro-card mb-12 p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="retro-title text-6xl mb-6">Social Smokers</h1>
            <p className="text-xl mb-6 text-[var(--color-text)]">
              A retro-styled webcomic exploring modern society through a unique
              lens
            </p>
            <Link href="/issue/1">
              <button className="retro-button">Start Reading</button>
            </Link>
          </div>
          <div className="w-full md:w-1/2 aspect-video relative">
            <FeaturedPanel />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1">
          {/* Latest Issues Section */}
          <section className="mb-12">
            <h2 className="retro-title text-4xl mb-8 text-center">
              Latest Issues
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(comics).map(([id, issue]) => (
                <Link href={`/issue/${id}`} key={id}>
                  <div className="retro-card group cursor-pointer h-full">
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <Image
                        src={issue.thumbnail || "/placeholder-comic.jpg"}
                        alt={issue.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-xl mb-1">
                          {issue.title}
                        </h3>
                        <span className="text-white/80 text-sm">
                          Issue #{id}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="retro-card p-6">
              <h3 className="text-[var(--color-primary)] font-bold text-xl mb-4">
                Weekly Updates
              </h3>
              <p className="text-[var(--color-text)]">
                New episodes every Monday! Follow our story as it unfolds.
              </p>
            </div>
            <div className="retro-card p-6">
              <h3 className="text-[var(--color-primary)] font-bold text-xl mb-4">
                Community
              </h3>
              <p className="text-[var(--color-text)]">
                Join our growing community of readers and creators.
              </p>
            </div>
          </section>
        </main>

        <aside className="lg:w-80">
          <div className="sticky top-4 space-y-6">
            {/* Coming Soon Section */}
            <div className="retro-card p-6">
              <h3 className="retro-title text-xl mb-4">Coming Soon</h3>
              <BannerAd />
            </div>

            {/* Quick Links */}
            <div className="retro-card p-6">
              <h3 className="retro-title text-xl mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link
                  href="/about"
                  className="block retro-button w-full text-center text-[var(--color-text)]"
                >
                  About Us
                </Link>
                <Link
                  href="/other"
                  className="block retro-button w-full text-center text-[var(--color-text)]"
                >
                  Extras
                </Link>
                <a
                  href="#"
                  className="block retro-button w-full text-center text-[var(--color-text)]"
                >
                  Discord
                </a>
              </div>
            </div>

            {/* Reading Progress */}
            <div className="retro-card p-6">
              <h3 className="retro-title text-xl mb-4">Your Progress</h3>
              <div className="space-y-2">
                <p className="text-sm text-[var(--color-text)]">
                  Continue reading from where you left off
                </p>
                <button className="retro-button w-full">Resume Reading</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
