import { supabase } from "../../lib/supabase";
import ComicViewer from "../../components/ComicViewer";
import Link from "next/link";
import BannerAd from "../../components/BannerAd";

async function getComic(id) {
  const { data, error } = await supabase
    .from("comics")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error:", error);
    return null;
  }

  return data;
}

async function getAdjacentComics(currentId) {
  const { data, error } = await supabase
    .from("comics")
    .select("id, title")
    .or(`id.eq.${currentId - 1},id.eq.${currentId + 1}`);

  if (error) {
    console.error("Error:", error);
    return { prevIssue: null, nextIssue: null };
  }

  const prevIssue = data.find((comic) => comic.id === currentId - 1);
  const nextIssue = data.find((comic) => comic.id === currentId + 1);

  return { prevIssue, nextIssue };
}

export default async function IssuePage({ params }) {
  const issueId = parseInt(params.id);
  const issue = await getComic(issueId);
  const { prevIssue, nextIssue } = await getAdjacentComics(issueId);

  if (!issue) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="retro-card p-8 text-center">
          <h1 className="text-2xl mb-4">Issue Not Found</h1>
          <Link href="/" className="retro-button">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title Section */}
      <div className="retro-card p-8 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="retro-title text-4xl mb-4">
              {issue.title} <span className="text-2xl">#{issue.id}</span>
            </h1>
            <p className="text-[var(--color-text)]">{issue.description}</p>
          </div>
          <Link href="/" className="retro-button">
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1">
          {/* Navigation */}
          <div className="flex justify-between mb-8">
            {prevIssue ? (
              <Link href={`/issue/${prevIssue.id}`} className="retro-button">
                ← Previous Issue
              </Link>
            ) : (
              <div></div>
            )}
            {nextIssue ? (
              <Link href={`/issue/${nextIssue.id}`} className="retro-button">
                Next Issue →
              </Link>
            ) : (
              <div></div>
            )}
          </div>

          {/* Comic Viewer */}
          <div className="retro-card p-4">
            <ComicViewer pages={issue.pages} />
          </div>

          {/* Tags */}
          <div className="mt-8">
            <h2 className="text-xl mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {issue.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
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
                  href="/search"
                  className="block retro-button w-full text-center text-[var(--color-text)]"
                >
                  Browse
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
          </div>
        </aside>
      </div>
    </div>
  );
}
