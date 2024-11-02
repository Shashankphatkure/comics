import Image from "next/image";
import Link from "next/link";
import { comics, featuredIssue } from "../data/comics";

export default function FeaturedPanel() {
  const featured = comics[featuredIssue];

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden comic-panel">
      <Image
        src={featured.pages[0]} // Using the first page as featured image
        alt={featured.title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-secondary)] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-[var(--color-text)] text-2xl font-bold mb-2">
          {featured.title}
        </h3>
        <p className="text-[var(--color-text-secondary)] mb-4">
          {featured.description}
        </p>
        <Link href={`/issue/${featuredIssue}`}>
          <button className="retro-button">Read Latest Issue</button>
        </Link>
      </div>
    </div>
  );
}
