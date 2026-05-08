import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { VideoPlayer } from "@/components/video-player";
import { getTitle } from "@/lib/catalog";

export const Route = createFileRoute("/watch/$id")({
  loader: ({ params }) => {
    const title = getTitle(params.id);
    if (!title) throw notFound();
    return { title };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: `Watch ${loaderData.title.title} — ThunderStream` }]
      : [],
  }),
  component: WatchPage,
  notFoundComponent: () => (
    <div className="px-8 py-20 text-center">
      <h1 className="text-3xl font-semibold">Title not found</h1>
      <Link to="/browse" className="mt-4 inline-block text-brand hover:underline">
        Browse the catalog
      </Link>
    </div>
  ),
});

function WatchPage() {
  const { title } = Route.useLoaderData();
  return <VideoPlayer title={title} />;
}
