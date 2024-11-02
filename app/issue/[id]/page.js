import { comics } from "@/app/data/comics";
import ComicViewer from "@/app/components/ComicViewer";
import BannerAd from "@/app/components/BannerAd";
import Link from "next/link";

export default async function IssuePage({ params }) {
  // Convert params.id to string to ensure consistent type
  const issueId = String(params.id);
  const issue = comics[issueId];
  const prevIssue = comics[Number(issueId) - 1];
  const nextIssue = comics[Number(issueId) + 1];

  if (!issue) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="retro-card p-8 text-center">
          <h2 className="retro-title text-2xl mb-4">Issue Not Found</h2>
          <p className="mb-6 text-[var(--color-text)]">
            This issue doesn't exist yet!
          </p>
          <Link href="/" className="retro-button">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1">
          {/* Issue Info */}
          <div className="retro-card p-6 mb-8">
            <h2 className="retro-title text-3xl mb-4">{issue.title}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {issue.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[var(--color-primary)] text-[var(--color-text)] rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-[var(--color-text)] mb-4">{issue.description}</p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Released: {new Date(issue.releaseDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1 text-[var(--color-text)]">
                <span className="text-[var(--color-primary)]">★</span>
                {issue.rating}
              </span>
            </div>
          </div>

          {/* Comic Viewer */}
          <ComicViewer issue={issueId} pages={issue.pages} />

          {/* Issue Navigation */}
          <div className="flex justify-between items-center mt-8">
            {prevIssue ? (
              <Link
                href={`/issue/${Number(issueId) - 1}`}
                className="retro-button"
              >
                ← Previous Issue
              </Link>
            ) : (
              <div />
            )}
            {nextIssue ? (
              <Link
                href={`/issue/${Number(issueId) + 1}`}
                className="retro-button"
              >
                Next Issue →
              </Link>
            ) : (
              <div />
            )}
          </div>
        </main>

        <aside className="lg:w-80">
          <div className="sticky top-4 space-y-6">
            {/* Ad Banner */}
            <div className="retro-card p-6">
              <h3 className="retro-title text-xl mb-4">Coming Soon</h3>
              <BannerAd />
            </div>

            {/* Other Issues */}
            <div className="retro-card p-6">
              <h3 className="retro-title text-xl mb-4">More Issues</h3>
              <div className="space-y-3">
                {Object.entries(comics)
                  .filter(([id]) => id !== issueId)
                  .slice(0, 3)
                  .map(([id, comic]) => (
                    <Link
                      key={id}
                      href={`/issue/${id}`}
                      className="block comic-panel p-3 hover:-translate-y-1 transition-transform"
                    >
                      <h4 className="font-bold text-[var(--color-primary)]">
                        {comic.title}
                      </h4>
                      <p className="text-sm text-[var(--color-text)]">
                        Issue #{id}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Reading Stats */}
            <div className="retro-card p-6">
              <h3 className="retro-title text-xl mb-4">Reading Stats</h3>
              <div className="space-y-2 text-[var(--color-text)]">
                <div className="flex justify-between">
                  <span>Time spent:</span>
                  <span>12 mins</span>
                </div>
                <div className="flex justify-between">
                  <span>Pages read:</span>
                  <span>6/12</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
