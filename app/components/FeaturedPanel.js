import Image from "next/image";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default async function FeaturedPanel({ latestIssueId }) {
  // Fetch the latest issue data
  const { data: latestIssue } = await supabase
    .from("comics")
    .select("*")
    .eq("id", latestIssueId)
    .single();

  if (!latestIssue) return null; // Don't render anything if no issue exists

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden comic-panel">
      <Image
        src={latestIssue.thumbnail || "/placeholder-comic.jpg"}
        alt={latestIssue.title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-secondary)] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-[var(--color-text)] text-2xl font-bold mb-2">
          {latestIssue.title}
        </h3>
        <p className="text-[var(--color-text-secondary)] mb-4">
          {latestIssue.description}
        </p>
        <Link href={`/issue/${latestIssueId}`}>
          <button className="retro-button">Read Latest Issue</button>
        </Link>
      </div>
    </div>
  );
}
