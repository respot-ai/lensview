import { NextResponse } from "next/server";
import { readPage, resolveSlug } from "@/lib/pages";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  const page = await resolveSlug(slug);
  if (!page) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (page.visibility === "protected") {
    // TODO(auth): gate protected pages with real auth (e.g. Clerk).
    // Until that lands, protected pages are unreachable.
    return new NextResponse("Not found", { status: 404 });
  }

  const html = await readPage(page);
  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
