import Link from "next/link";
import { listPublicPages } from "@/lib/pages";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const slugs = await listPublicPages();

  return (
    <main
      style={{
        maxWidth: 640,
        margin: "4rem auto",
        padding: "0 1rem",
        fontFamily: "system-ui, sans-serif",
        lineHeight: 1.5,
      }}
    >
      <h1>Lensview</h1>
      <p>Public pages hosted on this site.</p>

      {slugs.length === 0 ? (
        <p>
          <em>No pages yet — drop an HTML file into <code>pages-content/public/</code>.</em>
        </p>
      ) : (
        <ul>
          {slugs.map((slug) => (
            <li key={slug}>
              <Link href={`/${slug}`}>{slug}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
